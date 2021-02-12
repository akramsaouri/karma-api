import { Document, Model, model, Schema } from "mongoose";

import { IReason } from "./Reason";

enum TransactionType {
  ADD,
  SUB,
}

export const allowedTransactions = ["add", "sub"];

export interface ITransaction extends Document {
  amount: number;
  type: TransactionType;
  reason: IReason["_id"];
}

const transactionSchema: Schema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: 10,
    },
    type: {
      type: String,
      enum: allowedTransactions,
    },
    reason: {
      type: Schema.Types.ObjectId,
      ref: "Reason",
    },
  },
  { timestamps: true }
);

const Transaction: Model<ITransaction> = model(
  "Transaction",
  transactionSchema
);

export default Transaction;
