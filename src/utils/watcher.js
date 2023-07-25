import fs from "fs";
import fsp from "fs/promises";
import chokidar from "chokidar";
import moment from "moment";
import xlsx from "xlsx";

import db from "../config/db.js";

const root_folder = process.env.SOURCE_FILE;
const upload_path = process.env.UPLOAD_PATH;
const processed_path = process.env.PROCCESSED_FILE;
const failed_path = process.env.FAILED_FILE;
const source_folder = `${root_folder}/${upload_path}`;
const success_folder = `${root_folder}/${processed_path}`;
const failed_folder = `${root_folder}/${failed_path}`;
console.log(source_folder, "source_folder");
const watcher = chokidar.watch(`${source_folder}`, {
  persistent: true,
});

const insertOrUpdateDataOutlet = async (data, fileName) => {
  try {
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
        outletSiteNumber,
        idbranch,
        outletStatus,
        outletKlas,
        outletPelanggan,
        outletAlamat,
        outletCodeColl,
        outletCity,
        outletCustNumber
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const insertData = [
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

watcher.on("ready", () => {
  console.log("Watcher is ready and scanning files...");
  // You can optionally process existing files here if needed
});

watcher.on("add", async (path) => {
  const fileName = path.split("/").slice(-1)[0];
  if (fileName.toUpperCase().indexOf("M_OUTLET") != -1) {
    setTimeout(async () => {
      try {
        const workbook = xlsx.readFile(path, { raw: true });
        const sheet = workbook.SheetNames[0];
        const csvData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet]);
        for (const data of csvData) {
          await insertOrUpdateDataOutlet(data, fileName);
        }
        const newFileName = `${success_folder}/${fileName}`;
        fs.rename(path, newFileName, (err) => {
          if (err) {
            console.log(`Error while renaming after insert: ${err.message}`);
          } else {
            console.log(`Succeed to process and moved file to: ${newFileName}`);
          }
        });
      } catch (error) {
        const newFileName = `${failed_folder}/${fileName}`;
        fs.renameSync(path, newFileName, (err) => {
          if (err) {
            console.log(`Error while moving Failed file : ${err.message}`);
          } else {
            console.log(`Failed to process and moved file to: ${newFileName}`);
          }
        });
      }
    }, 800);
  }
});

export default watcher;
