import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // only 5 login attempts per IP
  message: {
    success: false,
    message: "Too many login attempts. Try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const resetRequestLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // only 3 OTP requests per minute
  message: {
    success: false,
    message: "Too many OTP requests. Please wait a minute.",
  },
});

export const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // only 5 attempts
  message: {
    success: false,
    message: "Too many reset attempts. Try again later.",
  },
});