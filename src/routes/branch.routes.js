import express from "express";
import { createBranch } from "../controllers/POS/branch.controller.js";
import { verifyToken } from "../middleware/auth/authMiddleware.js";
import { isAdminOrSuperAdmin } from "../middleware/auth/roleMiddleware.js";

const router = express.Router();

/* CREATE BRANCH */
router.post("/create",verifyToken,isAdminOrSuperAdmin,createBranch);

export default router;