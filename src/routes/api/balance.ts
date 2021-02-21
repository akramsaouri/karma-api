import { Router, Response } from "express";
import HttpStatusCodes from "http-status-codes";

import { getEnv } from "../../../config/env";
import Balance from "../../models/Balance";
import Request from "../../types/Request";

const router: Router = Router();

router.get("/", async (_: Request, res: Response) => {
  try {
    const balance = await Balance.findOne({
      _id: process.env.BALANCE_ID,
    });
    res.json({ balance });
  } catch (err) {
    console.log(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

router.post("/", async (_: Request, res: Response) => {
  res.status(HttpStatusCodes.UNAUTHORIZED).send("Unauthorized");
  try {
    const balance = new Balance({
      value: 0,
    });
    await balance.save();
    res.json(balance);
  } catch (err) {
    console.log(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

export default router;
