import nodemailer from "nodemailer";
import { passwordResetRequestTemplate } from "../templates/otpEmailTemplate.js";

export const sendOtpEmail = async (email, first_name, surname, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Hardware POS" <${process.env.EMAIL}>`,
    to: email,
    subject: "Password Reset OTP",
    html: passwordResetRequestTemplate(first_name, surname, otp),
  });
};