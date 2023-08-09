import schedule from "node-schedule";
import mssql from "mssql";
import { configSqlServer, getPoolToSimpiTest } from "../../config/db.js";

// Insert to table rayon Db ke simpe_test
const importDataRayonToSimpi = async () => {
  const batchSize = 1000;
  await mssql.connect(configSqlServer);
  // select data rayon from sql
  const query = `SELECT
                  a.szId AS kode_rayon,
                  a.szName AS nama_rayon,
                  a.szEmployeeId AS kode_sales,
                  c.szName AS nama_sales,
                  b.szCustomerId AS kode_customer,
                  d.szName AS nama_customer
                FROM DMS_SD_Route a
                INNER JOIN DMS_SD_RouteItem b ON a.szId = b.szId
                LEFT JOIN DMS_PI_Employee c ON a.szEmployeeId = c.szId
                LEFT JOIN DMS_AR_Customer d ON b.szCustomerId = d.szId
                ORDER BY a.szId;
                `;

  const poolToSimpi = await getPoolToSimpiTest();
  try {
    const result = await mssql.query(query);

    const data = result.recordset;
    if (data.length > 0) {
      await poolToSimpi.query("START TRANSACTION");
      const truncateQuery = `TRUNCATE TABLE rayon`;
      await poolToSimpi.query(truncateQuery);
      const chunks = [];
      for (let i = 0; i < data.length; i += batchSize) {
        chunks.push(data.slice(i, i + batchSize));
      }

      for (const chunk of chunks) {
        const values = chunk.map((data) => [
          data?.kode_rayon,
          data?.nama_rayon,
          data?.kode_sales,
          data?.nama_sales,
          data?.kode_customer,
          data?.nama_customer,
        ]);

        // query insert only
        const insertQuery = `
          INSERT INTO rayon (kode_rayon, nama_rayon, kode_sales, nama_sales, kode_customer, nama_customer)
          VALUES ?
          ON DUPLICATE KEY UPDATE
            kode_rayon = VALUES(kode_rayon),
            nama_rayon = VALUES(nama_rayon),
            kode_sales = VALUES(kode_sales),
            nama_sales = VALUES(nama_sales),
            kode_customer = VALUES(kode_customer),
            nama_customer = VALUES(nama_customer);
        `;

        const execQuery = await poolToSimpi.query(insertQuery, [values]);
        console.log(
          "Batch inserted. Row(s) affected:",
          execQuery[0]?.affectedRows
        );
      }

      console.log("All batches inserted successfully.");
      await poolToSimpi.query("COMMIT");
    }
  } catch (error) {
    await poolToSimpi.query("ROLLBACK");
    console.error("Error executing query:", error);
  }
};

// Insert to table pricelist Db ke simpe_test
const importDataPriceListToSimpi = async () => {
  const batchSize = 1000;
  await mssql.connect(configSqlServer);
  // select data rayon from sql
  const query = `select * from dms_sd_pricecatalog a
                  inner join DMS_SD_PriceCatalogItemCombinationValue b on a.szid = b.szid
                  inner join DMS_SD_PriceCatalogItemCombinationValueItem c on b.szid = c.szid
                  WHERE c.dtmStartDate <=  GETDATE()
                  AND c.dtmEndDate >=  GETDATE()
                `;

  const poolToSimpi = await getPoolToSimpiTest();
  try {
    const result = await mssql.query(query);

    const data = result.recordset;
    console.log(data, "dataa");
    if (data.length > 0) {
      await poolToSimpi.query("START TRANSACTION");
      const truncateQuery = `TRUNCATE TABLE price_list`;
      await poolToSimpi.query(truncateQuery);
      const chunks = [];
      for (let i = 0; i < data.length; i += batchSize) {
        chunks.push(data.slice(i, i + batchSize));
      }

      for (const chunk of chunks) {
        const values = chunk.map((data) => [
          data?.iInternalId,
          data?.iId,
          data?.szId,
          data?.szName,
          data?.szDescription,
          data?.szCombinationId,
          data?.szCompanyId,
          data?.dtmValidFrom,
          data?.dtmValidTo,
          data?.intPriority,
          data?.bActive,
          data?.szUserCreatedId,
          data?.szUserUpdatedId,
          data?.dtmCreated,
          data?.dtmLastUpdated,
          data?.szStatusSubmitFusion,
          data?.iInternalId_1,
          data?.iId_1,
          data?.szId_1,
          data?.intItemNumber,
          data?.szCombinationId_1,
          data?.szCombinationValue,
          data?.szCombinationValueNm,
          data?.iInternalId_2,
          data?.iId_2,
          data?.szId_2,
          data?.intItemNumber_1,
          data?.intItemNumber2,
          data?.szProductId,
          data?.decMinQty,
          data?.bIncludeTax,
          data?.decPrice,
          data?.szUomId,
          data?.intLine,
          data?.dtmStartDate,
          data?.dtmEndDate,
          data?.szPriceListId,
          data?.szPriceListItemId,
          data?.szPriceListChargeId,
        ]);

        // query insert only
        const insertQuery = `
          INSERT INTO your_table_name (
              iInternalId, iId, szId, szName, szDescription, szCombinationId, szCompanyId,
              dtmValidFrom, dtmValidTo, intPriority, bActive, szUserCreatedId, szUserUpdatedId,
              dtmCreated, dtmLastUpdated, szStatusSubmitFusion,
              iInternalId_1, iId_1, szId_1, intItemNumber, szCombinationId_1,
              szCombinationValue, szCombinationValueNm,
              iInternalId_2, iId_2, szId_2, intItemNumber_1, intItemNumber2,
              szProductId, decMinQty, bIncludeTax, decPrice, szUomId,
              intLine, dtmStartDate, dtmEndDate, szPriceListId,
              szPriceListItemId, szPriceListChargeId
          )
          VALUES (
              ?, ?, ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?, ?,
              ?, ?, ?,
              ?, ?, ?, ?, ?,
              ?, ?,
              ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?,
              ?, ?, ?, ?,
              ?, ?
          );
          `;

        const execQuery = await poolToSimpi.query(insertQuery, [values]);
        console.log(
          "Batch inserted. Row(s) affected:",
          execQuery[0]?.affectedRows
        );
      }

      console.log("All batches inserted successfully.");
      await poolToSimpi.query("COMMIT");
    }
  } catch (error) {
    await poolToSimpi.query("ROLLBACK");
    console.error("Error executing query:", error);
  }
};

schedule.scheduleJob("0 3 * * *", async () => {
  console.log("schedule run every day at 3 am start");
  const resRayon = await importDataRayonToSimpi();
  console.log(resRayon, "resRayon");
});
console.log(importDataPriceListToSimpi(), "running");
