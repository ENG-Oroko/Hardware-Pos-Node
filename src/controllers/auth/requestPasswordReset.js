import db from "../../config/db.js";
import { sendOtpEmail } from "../../utils/sendOtp.js";
import { generateOtp } from "../../utils/generateOtp.js";

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const { rowCount } = await db.query(
      "SELECT 1 FROM users WHERE email = $1",
      [email]
    );

    if (!rowCount) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = generateOtp(); // ⚡ clean import
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await db.query(
      `INSERT INTO password_reset_otps (email, otp, expires_at)
       VALUES ($1, $2, $3)`,
      [email, otp, expiresAt]
    );

    sendOtpEmail(email, otp).catch(() => {});

    return res.json({
      success: true,
      message: "OTP sent",
    });

  } catch {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};