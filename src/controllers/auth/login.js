import bcrypt from "bcrypt";
import db from "../../config/db.js";
import { generateToken } from "../../utils/jwt.js";

/* ======================
   LOGIN USER
====================== */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. check user
    const userResult = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    const user = userResult.rows[0];

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 2. check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 3. generate token
    const token = generateToken(user);

    // 4. set cookie (SECURE WAY)
    res.cookie("token", token, {
      httpOnly: true, // prevents JS access (XSS protection)
      secure: false,  // set true in production (HTTPS)
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

// 5. response (include token for testing)
res.json({
  success: true,
  message: "Login successful",
  token, // 👈 add this
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  },
});

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};