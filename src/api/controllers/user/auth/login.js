import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getPoolToBizops } from "../../../../config/db.js";

export default async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      status: true,
      data: {
        token,
      },
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    return res.status(500).json({ error: "Login error" });
  }
};

async function getUserByEmail(email) {
  const pool = await getPoolToBizops();
  const sql = "SELECT * FROM user WHERE email = ?";
  const results = await pool.query(sql, [email]);
  return results[0][0];
}
