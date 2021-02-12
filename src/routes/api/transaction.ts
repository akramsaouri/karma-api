import { Router, Response } from "express";
import { check, validationResult } from "express-validator/check";
import HttpStatusCodes from "http-status-codes";

import Transaction, { allowedTransactions } from "../../models/Transaction";
import Balance from "../../models/Balance";
import Request from "../../types/Request";

const router: Router = Router();

router.get("/", async (_: Request, res: Response) => {
  try {
    const transactions = await Transaction.find().populate("reason");
    transactions.reverse();
    const sum = transactions.reduce(
      (acc: number, curr: any) => acc + curr.amount,
      0
    );
    return res.json([
      {
        id: "hardcodedsection",
        meta: {
          date: "This month",
          sum,
        },
        transactions,
      },
    ]);
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
