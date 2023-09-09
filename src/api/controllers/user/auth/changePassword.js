import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getPoolToBizops } from "../../../../config/db.js";

export default async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  try {
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid old password" });
    }
    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    await updatePassword(userId, newHashedPassword);
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Password changed successfully", token });
  } catch (error) {
    console.error("Error changing password:", error.message);
    return res.status(500).json({ error: "Password change error" });
  }
};

// Helper function to retrieve a user by userId from the database
async function getUserById(userId) {
  const pool = await getPoolToBizops();

  const sql = "SELECT * FROM user WHERE id = ?";
  const results = await pool.query(sql, [userId]);

  return results[0][0];
}

// Helper function to update the user's password in the database
async function updatePassword(userId, newPassword) {
  const pool = await getPoolToBizops();
  const sql = "UPDATE user SET password = ? WHERE id = ?";
  await pool.query(sql, [newPassword, userId]);
}
