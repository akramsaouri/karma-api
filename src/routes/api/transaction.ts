import { Router, Response } from "express";
import { check, validationResult } from "express-validator/check";
import HttpStatusCodes from "http-status-codes";

import Transaction, { allowedTransactions } from "../../models/Transaction";
import Balance from "../../models/Balance";
import Request from "../../types/Request";

const router: Router = Router();

router.get("/", async (_: Request, res: Response) => {
  const reasonPopulate = {
    $lookup: {
      from: "reasons",
      localField: "reason",
      foreignField: "_id",
      as: "reason",
    },
  };

  const groupByDate = {
    $group: {
      _id: {
        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
      },
      totalAmount: {
        $sum: "$amount",
      },
      transactions: {
        $push: "$$ROOT",
      },
    },
  };

  const projectFields = {
    $project: {
      _id: 0,
      totalAmount: 1,
      transactions: 1,
      date: "$_id",
    },
  };
  try {
    const transactions = await Transaction.aggregate([
      reasonPopulate,
      { $unwind: "$reason" },
      groupByDate,
      projectFields,
    ]).sort({ date: -1 });
    return res.json(transactions);
  } catch (err) {
    console.log(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

router.post(
  "/",
  [
    check("amount", "Amount is not valid").isNumeric(),
    check("type", "Type is not valid").isIn(allowedTransactions),
    check("reason", "Reason must be a mongo id").isMongoId(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const { amount, type, reason } = req.body;

    try {
      const transaction = new Transaction({ amount, type, reason });
      await transaction.save();
      const update = {
        $inc: {
          value: type === "add" ? amount : -amount,
        },
      };
      await Balance.findOneAndUpdate(
        { _id: process.env.BALANCE_ID },
        // @ts-ignore
        update
      );
      res.json(transaction);
    } catch (err) {
      console.log(err.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  }
);

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { deletedCount } = await Transaction.remove({ _id: req.params.id });
    res.json({ deletedCount });
  } catch (err) {
    console.log(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

export default router;
