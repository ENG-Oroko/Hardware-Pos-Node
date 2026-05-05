import express from "express";
import { loginUser } from "../controllers/auth/login.js";
import { requestPasswordReset } from "../controllers/auth/requestPasswordReset.js";
import { resetPassword } from "../controllers/auth/resetPassword.js";
import {
  loginLimiter,
  resetRequestLimiter,
  resetPasswordLimiter,
} from "../middleware/rateLimiter.js";

import {
  loginValidation,
  requestResetValidation,
  resetPasswordValidation,
} from "../middleware/auth/validateLogin.js";

const router = express.Router();

router.post("/login", loginLimiter, loginValidation, loginUser);
router.post("/request-reset",resetRequestLimiter,requestResetValidation,requestPasswordReset);
router.post("/reset-password",resetPasswordLimiter,resetPasswordValidation,resetPassword);

export default router;