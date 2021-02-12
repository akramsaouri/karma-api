import { Document, Model, model, Schema } from "mongoose";

export interface IBalance extends Document {
  value: string;
}

const balanceSchema: Schema = new Schema(
  {
    value: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Balance: Model<IBalance> = model("Balance", balanceSchema);

export default Balance;
