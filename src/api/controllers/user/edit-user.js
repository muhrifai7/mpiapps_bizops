import { getPoolToBizops } from "../../../config/db.js";

export default async (req, res) => {
  const { id } = req.params; // Assuming userId is part of the URL
  const { username, role_id } = req.body;

  try {
    // Check if the user with the provided userId exists
    const existingUser = await getUserById(id);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }
    await updateUser(id, username, role_id);
    return res
      .status(200)
      .json({ status: true, message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error.message);
    return res.status(500).json({ error: "User update error" });
  }
};

async function getUserById(userId) {
  const pool = await getPoolToBizops();
  const sql = "SELECT * FROM user WHERE id = ?";
  const [results] = await pool.query(sql, [userId]);
  return results[0];
}

// Helper function to update the user's information in the database
async function updateUser(userId, newUsername, newRoleId) {
  const pool = await getPoolToBizops();
  const sql = "UPDATE user SET username = ?, role_id = ? WHERE id = ?";
  await pool.query(sql, [newUsername, newRoleId, userId]);
}
