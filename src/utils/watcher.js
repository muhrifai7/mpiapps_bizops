import fs from "fs";
import fsp from "fs/promises";
import chokidar from "chokidar";
import moment from "moment";
import xlsx from "xlsx";

import db from "../config/db.js";

// const source_folder = "/home/opc/CSV_File";
const source_folder = "/Users/rifai/CSV_File/upload";
// const source_folder = ".";
const watcher = chokidar.watch(`${source_folder}`, {
  persistent: true,
});

const insertOrUpdateDataOutlet = async (data, fileName) => {
  try {
    console.log(data, "data");
    const outletSiteNumber = data.OUTLETSITENUMBER;

    // Check if the outlet already exists in the database based on the outletSiteNumber
    const checkExist = await db.query(
      `SELECT id FROM m_outlet WHERE outletSiteNumber = ?`,
      [outletSiteNumber]
    );

    if (checkExist && checkExist.length > 0) {
      // Outlet exists, so update the data in m_outlet
      const outletId = checkExist[0].id;
      const updateQuery = `UPDATE m_outlet SET
        outletSiteNumber = ?,
        idbranch = ?,
        outletStatus = ?,
        outletKlas = ?,
        outletPelanggan = ?,
        outletAlamat = ?,
        outletCodeColl = ?,
        outletCity = ?,
        outletCustNumber = ?
            WHERE id = ?`;

      const updateData = [
        data.OUTLETSITENUMBER,
        data.BRANCHID,
        data.STATUS_OUTLET,
        data.OUTLETKLAS,
        data.OUTLETPELANGGAN,
        // data.OUTLETKRLIMIT,
        data.OUTLETALAMAT,
        data.OUTLETCODECOLL,
        data.OUTLETCITY,
        data.CUSTOMERID,
        outletId,
      ];

      await db.query(updateQuery, updateData);
      console.log(
        `Outlet with outletSiteNumber ${outletSiteNumber} updated successfully!`
      );
    } else {
      // Outlet does not exist, so insert the data into m_outlet
      const insertQuery = `INSERT INTO m_outlet (
            ACCOUNT_TERMINATION_DATE,
            OUTLETSITENUMBER,
            BRANCHID,
            STATUS_OUTLET,
            OUTLETKLAS,
            OUTLETPELANGGAN,
            OUTLETKRLIMIT,
            OUTLETALAMAT,
            OUTLETCODECOLL,
            OUTLETCITY,
            CUSTOMERID,
            PARTYNAME,
            NPWP,
            TAX_CODE,
            CUST_ID,
            CUSTOMERNUMBER,
            PARTYSITEID,
            REFERENCESITENUMBER,
            SIA,
            SIPA,
            EDOUT,
            EDSIPA
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const insertData = [
        data.ACCOUNT_TERMINATION_DATE,
        data.OUTLETSITENUMBER,
        data.BRANCHID,
        data.STATUS_OUTLET,
        data.OUTLETKLAS,
        data.OUTLETPELANGGAN,
        data.OUTLETKRLIMIT,
        data.OUTLETALAMAT,
        data.OUTLETCODECOLL,
        data.OUTLETCITY,
        data.CUSTOMERID,
        data.PARTYNAME,
        data.NPWP,
        data.TAX_CODE,
        data.CUST_ID,
        data.CUSTOMERNUMBER,
        data.PARTYSITEID,
        data.REFERENCESITENUMBER,
        data.SIA,
        data.SIPA,
        data.EDOUT,
        data.EDSIPA,
      ];

      await db.query(insertQuery, insertData);
      console.log(
        `Outlet with outletSiteNumber ${outletSiteNumber} inserted successfully!`
      );
    }
  } catch (err) {
    console.log("Error inserting/updating data:", err);
    return err;
  }
};

watcher.on("add", async (path) => {
  try {
    console.log("File added:", path);

    const workbook = xlsx.readFile(path, { raw: true });
    const sheet = workbook.SheetNames[0];
    const fileName = path.split("/").slice(-1)[0];
    const csvData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet]);
    for (const data of csvData) {
      await insertOrUpdateDataOutlet(data, fileName);
    }
  } catch (error) {
    console.error("Error processing file:", error);
  }
});

export default watcher;
