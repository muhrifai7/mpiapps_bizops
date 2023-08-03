import dotenv from "dotenv";
dotenv.config();
import mssql from "mssql";
import mysql from "mysql2/promise";

let poolToWebDiskon = null;
let poolToSimpi = null;
let poolToSqlServer = null;

export async function getPoolToWebDiskon() {
  if (!poolToWebDiskon) {
    try {
      poolToWebDiskon = mysql.createPool({
        host: "202.157.186.47",
        user: "mpiapps_technical",
        password: "Technical123",
        database: "mpiapps_diskon_modifier_test",
        connectionLimit: 10, // Adjust the limit as per your requirements
      });
      console.log("Connected to WebDiskon database!");
    } catch (error) {
      console.error("Error connecting to the database:", error.message);
    }
  }
  return poolToWebDiskon;
}

export async function getPoolToSimpi() {
  if (!poolToSimpi) {
    try {
      poolToSimpi = mysql.createPool({
        host: "202.157.186.47",
        user: "mpiapps_technical",
        password: "Technical123",
        database: "mpiapps_simpi_test",
        connectionLimit: 10, // Adjust the limit as per your requirements
      });
      console.log("Connected to Simpi database!");
    } catch (error) {
      console.error("Error connecting to the database:", error.message);
    }
  }
  return poolToSimpi;
}

export async function getPoolToSqlServer() {
  if (!poolToSqlServer) {
    try {
      poolToSqlServer = mssql.createPool({
        user: "sa",
        password: "P@ssw0rd.1",
        database: "DEV_MPI_TRAINING",
        server: "172.16.1.22",
      });
      console.log(poolToSqlServer, "poolToSqlServer");
      console.log("Connected to Sql Server database!");
    } catch (error) {
      console.error("Error connecting to the database:", error.message);
    }

    return poolToSqlServer;
  }
}
