import dotenv from "dotenv";
dotenv.config();
import mssql from "mssql";
import mysql from "mysql2/promise";

let poolToWebDiskon = null;
let poolToBizops = null;
let poolToBizopsTest = null;
let poolToSqlServer = null;

export async function getPoolToBizops() {
  if (!poolToBizops) {
    try {
      poolToBizops = mysql.createPool({
        host: "202.157.186.47",
        user: "mpiapps_technical",
        password: "Technical123",
        database: "mpiapps_bizops",
        connectionLimit: 10, // Adjust the limit as per your requirements
        port: 3306,
      });
      console.log("Connected to Bizops database!");
    } catch (error) {
      console.error("Error connecting to the database:", error.message);
    }
  }
  return poolToBizops;
}

export async function getPoolToBizopsTest() {
  if (!poolToBizopsTest) {
    try {
      poolToBizops = mysql.createPool({
        host: "202.157.186.47",
        user: "mpiapps_technical",
        password: "Technical123",
        database: "mpiapps_bizops_test",
        connectionLimit: 10, // Adjust the limit as per your requirements
        port: 3306,
      });
      console.log("Connected to Bizops database!");
    } catch (error) {
      console.error("Error connecting to the database:", error.message);
    }
  }
  return poolToBizops;
}

export const configSqlServerLocal = {
  user: "sa",
  password: "v6khN0n2KO14g4CgYK",
  server: "localhost",
  database: "DEV_MPI_TRAINING", // Replace with the actual name of your database
  options: {
    trustServerCertificate: true, // For development purposes only. Set to true for self-signed certificates in development environment.
  },
};

export const configSqlServer = {
  user: "sa",
  password: "P@ssw0rd.1",
  server: "172.16.1.22",
  database: "MPI_PROD_NEW", // Replace with the actual name of your database
  options: {
    trustServerCertificate: true, // For development purposes only. Set to true for self-signed certificates in development environment.
  },
};
