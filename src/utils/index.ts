import { IReason } from "../models/Reason";

export const withoutAddReason = (reason: IReason) =>
  reason.id !== process.env.ADD_REASON_ID;
