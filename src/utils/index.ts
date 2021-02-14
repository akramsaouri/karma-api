import { getEnv } from "../../config/env";
import { IReason } from "../models/Reason";

export const withoutAddReason = (reason: IReason) =>
  reason.id !== getEnv("ADD_REASON_ID");
