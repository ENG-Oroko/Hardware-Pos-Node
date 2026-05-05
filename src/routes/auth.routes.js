import express from "express";
import { loginUser } from "../controllers/auth.controller.js";
import { requestPasswordReset } from "../controllers/requestPasswordReset.js";
import { resetPassword } from "../controllers/resetPassword.js";
import { loginLimiter } from "../middleware/rateLimiter.js";
import { loginValidation } from "../middleware/auth/validateLogin.js";

const router = express.Router();

router.post("/login", loginLimiter, loginValidation, loginUser);
router.post("/request-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

export default router;