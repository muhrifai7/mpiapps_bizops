import { getPoolToBizops } from "../../../config/db.js";

export default async (req, res) => {
  const pool = await getPoolToBizops();
  try {
    const query = "SELECT * FROM user";
    const execQuery = await pool.query(query);
    return res.json({ status: true, data: execQuery[0] });
  } catch (error) {
    console.error("Error retrieving outlet:", error.message);
  }
};
