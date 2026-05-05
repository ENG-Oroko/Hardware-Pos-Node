import db from "../../config/db.js";
import { hashPassword } from "../../utils/hashPassword.js";

/* ======================
   RESET PASSWORD (FAST)
====================== */
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // ⚡ fast OTP lookup (minimal columns)
    const { rows } = await db.query(
      `SELECT id, expires_at
       FROM password_reset_otps
       WHERE email = $1 AND otp = $2 AND used = false
       ORDER BY created_at DESC
       LIMIT 1`,
      [email, otp]
    );

    const record = rows[0];

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // ⚡ expiry check (fast fail)
    if (new Date(record.expires_at) < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // ⚡ hash password (external utility)
    const hashedPassword = await hashPassword(newPassword);

    // ⚡ parallel-safe updates (faster execution)
    await Promise.all([
      db.query(
        `UPDATE users SET password = $1 WHERE email = $2`,
        [hashedPassword, email]
      ),

      db.query(
        `UPDATE password_reset_otps SET used = true WHERE id = $1`,
        [record.id]
      ),
    ]);

    return res.json({
      success: true,
      message: "Password reset successful",
    });

  } catch {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};