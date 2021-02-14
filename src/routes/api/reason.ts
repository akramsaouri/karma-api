import { Router, Response } from "express";
import { check, validationResult } from "express-validator/check";
import HttpStatusCodes from "http-status-codes";

import Reason from "../../models/Reason";
import Request from "../../types/Request";
import { withoutAddReason } from "../../utils";

const router: Router = Router();

router.get("/", async (_: Request, res: Response) => {
  try {
    const reasons = await Reason.find();
    res.json(reasons.filter(withoutAddReason));
  } catch (err) {
    console.log(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("icon", "Icon is required").not().isEmpty(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const { name, icon } = req.body;

    try {
      const reason = new Reason({ name, icon });
      await reason.save();
      res.json(reason);
    } catch (err) {
      console.log(err.message);
      if (err.message.includes("duplicate key error collection")) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          errors: [
            {
              msg: "Reason already exists",
            },
          ],
        });
      }
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  }
);

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { deletedCount } = await Reason.remove({ _id: req.params.id });
    res.json({ deletedCount });
  } catch (err) {
    console.log(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

export default router;
