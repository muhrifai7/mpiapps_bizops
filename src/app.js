import express from "express";
import routes from "./api/routes/index.js";
import dotenv from "dotenv";
import mssql from "mssql";

dotenv.config();
const app = express();
const port = process.env.PORT || 3002;

const sqlConfig = {
  user: "sa",
  password: "P@ssw0rd.1",
  database: "DEV_MPI_TRAINING",
  server: "172.16.1.22",
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: false, // change to true for local dev / self-signed certs
  },
};

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
    console.log("dsadas");
    // make sure that any items are correctly URL encoded in the connection string
    await mssql.connect(sqlConfig);
    const result = await mssql.query`select * from mytable where id = ${value}`;
    console.dir(result);
  } catch (err) {
    console.log(err, "err");
    // ... error checks
  }
})();
