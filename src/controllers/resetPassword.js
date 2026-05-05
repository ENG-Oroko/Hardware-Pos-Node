import db from "../config/db.js";
import bcrypt from "bcrypt";

/* ======================
   RESET PASSWORD (VERIFY OTP)
====================== */
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // 1. get OTP record
    const otpResult = await db.query(
      `SELECT * FROM password_reset_otps
       WHERE email = $1 AND otp = $2 AND used = false
       ORDER BY created_at DESC
       LIMIT 1`,
      [email, otp]
    );

    const record = otpResult.rows[0];

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // 2. check expiry
    const now = new Date();
    if (new Date(record.expires_at) < now) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // 3. hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4. update password
    await db.query(
      `UPDATE users
       SET password = $1
       WHERE email = $2`,
      [hashedPassword, email]
    );

    // 5. mark OTP as used
    await db.query(
      `UPDATE password_reset_otps
       SET used = true
       WHERE id = $1`,
      [record.id]
    );

    res.json({
      success: true,
      message: "Password reset successful",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};