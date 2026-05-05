import db from "../config/db.js";
import { sendOtpEmail } from "../utils/sendOtp.js";


export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. check user exists
    const user = await db.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 2. generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    // 3. save OTP in DB
    await db.query(
      `INSERT INTO password_reset_otps (email, otp, expires_at)
       VALUES ($1, $2, $3)`,
      [email, otp, expiresAt]
    );

    // 4. send email
    await sendOtpEmail(email, otp);

    res.json({
      success: true,
      message: "OTP sent to email",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};