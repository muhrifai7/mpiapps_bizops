import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getPoolToBizops } from "../../../../config/db.js";

export default async (req, res) => {
  const pool = await getPoolToBizops();

  const { username, email, password, role_id } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = {
      username,
      email,
      password: hash,
      role_id: role_id,
    };

    const result = await pool.query("INSERT INTO user SET ?", user);
    // The rest of your code
    const token = jwt.sign(
      { userId: result.insertId },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({
      status: true,
      data: {
        token,
      },
    });
  } catch (error) {
    console.error("Error during user registration:", error.message);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Email already exists" });
    }
    return res.status(500).json({ error: "User registration error" });
  }
};
