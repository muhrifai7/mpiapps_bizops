import express from "express";
import routes from "./api/routes/index.js";
import dotenv from "dotenv";
import mssql from "mssql";

import { configSqlServer, configSqlServerLocal } from "./config/db.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3002;

// Middleware to parse incoming JSON data
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.use("/api", routes);
// Start the server
app.listen(port, () => {
  console.log(`Server is running on ${process.env.ENV}:${port}`);
});

(async () => {
  try {
    console.log("run test");
    // make sure that any items are correctly URL encoded in the connection string
    await mssql.connect(configSqlServer);
    const result = await mssql.query`select * from DMS_SD_Route`;
    console.log("test", result);
  } catch (err) {
    console.log(err, "err");
    // ... error checks
  }
})();
