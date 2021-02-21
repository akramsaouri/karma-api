import bodyParser from "body-parser";
import express from "express";
import dotenv from "dotenv";

import connectDB from "../config/database";
import reason from "./routes/api/reason";
import transaction from "./routes/api/transaction";
import balance from "./routes/api/balance";

const app = express();

const result = dotenv.config();
if (result.error) {
  console.warn(result.error);
}
connectDB();

app.set("port", process.env.PORT || 5000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (_req, res) => {
  res.send("Status: OK");
});

app.use("/api/reasons", reason);
app.use("/api/transactions", transaction);
app.use("/api/balance", balance);

const port = app.get("port");
const server = app.listen(port, () =>
  console.log(`Server started on port ${port}`)
);

export default server;
