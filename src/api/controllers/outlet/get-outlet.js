import connection from "../../../config/db.js";

export default async (req, res) => {
  try {
    const [results, fields] = await connection.query(
      "SELECT * FROM `m_outlet` WHERE `id` = 1"
    );
    return res.json({ status: true, data: results });
  } catch (error) {
    console.error("Error retrieving outlet:", error.message);
  }
};
