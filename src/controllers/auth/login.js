import bcrypt from "bcrypt";
import db from "../../config/db.js";
import { generateToken } from "../../utils/jwt.js";

/* ======================
   FAST LOGIN USER
====================== */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ⚡ 1. FAST QUERY (only needed fields)
    const { rows } = await db.query(
      `SELECT id, first_name, second_name, surname, email, password, role, store_id
       FROM users
       WHERE email = $1
       LIMIT 1`,
      [email]
    );

    const user = rows[0];

    // ⚡ 2. EARLY EXIT (faster failure)
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // ⚡ 3. PASSWORD CHECK (fast fail first)
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // ⚡ 4. GENERATE TOKEN (minimal payload)
    const token = generateToken(user);

    // ⚡ 5. SET COOKIE (fast + secure)
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // ⚡ 6. RESPONSE (minimal + fast)
    return res.json({
      success: true,
      message: "Login successful",
      token, // optional for testing
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        store_id: user.store_id,
      },
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};