import { Document, Model, model, Schema } from "mongoose";

export interface IReason extends Document {
  name: string;
}

const reasonSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    icon: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const Reason: Model<IReason> = model("Reason", reasonSchema);

export default Reason;
