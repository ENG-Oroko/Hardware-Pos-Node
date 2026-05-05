export const passwordResetRequestTemplate = (firstName, surname, otp) => {
  return `
  <div style="
    font-family: Arial, sans-serif;
    background-color: #f4f6f8;
    padding: 40px;
  ">
    <div style="
      max-width: 520px;
      margin: auto;
      background: #ffffff;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    ">

      <h2 style="color:#111827; text-align:center;">
        🔐 Password Reset Request
      </h2>

      <p style="
        color:#374151;
        font-size:14px;
        text-align:center;
      ">
        Hello <b>${firstName} ${surname}</b>,
      </p>

      <p style="
        color:#374151;
        font-size:14px;
        text-align:center;
      ">
        We received a request to reset your password for your Hardware POS account.
      </p>

      <div style="
        text-align:center;
        margin: 25px 0;
      ">
        <p style="
          font-size:14px;
          color:#6b7280;
        ">
          Use the OTP below to continue:
        </p>

        <div style="
          display:inline-block;
          padding: 15px 30px;
          font-size: 28px;
          letter-spacing: 5px;
          font-weight: bold;
          color: #1d4ed8;
          background: #eff6ff;
          border-radius: 8px;
        ">
          ${otp}
        </div>
      </div>

      <p style="
        text-align:center;
        font-size:13px;
        color:#6b7280;
      ">
        This code will expire in <b>5 minutes</b>.
      </p>

      <hr style="margin: 25px 0; border: none; border-top: 1px solid #e5e7eb;" />

      <p style="
        font-size:12px;
        color:#9ca3af;
        text-align:center;
      ">
        If you did not request this password reset, you can safely ignore this email.
      </p>

      <p style="
        font-size:12px;
        color:#9ca3af;
        text-align:center;
      ">
        © Hardware POS System
      </p>

    </div>
  </div>
  `;
};