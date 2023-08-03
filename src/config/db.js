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
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME_DISKON,
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
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
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
      poolToSqlServer = await mssql.createPool({
        user: process.env.SQL_DB_USER,
        password: process.env.SQL_DB_PASS,
        database: process.env.SQL_DB_NAME_TEST,
        server: process.env.SQL_HOST,
      });

      console.log("Connected to WebDiskon database!");
    } catch (error) {
      console.error("Error connecting to the database:", error.message);
    }

    return poolToSqlServer;
  }
}
