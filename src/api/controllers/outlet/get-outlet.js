import { getPoolToBizops } from "../../../config/db.js";

export default async (req, res) => {
  try {
    const pool = await getPoolToBizops();
    const query = "SELECT * FROM `m_outlet` WHERE `id` = 1";
    const execQuery = await pool.query(query);
    console.log(execQuery, "execQuery");
    return res.json({ status: true, data: results });
  } catch (error) {
    console.error("Error retrieving outlet:", error.message);
  }
};
