import express from "express";
import { createStoreWithAdmin } from "../controllers/superadmin/admin.store.js";
import { verifyToken } from "../middleware/auth/authMiddleware.js";
import { isSuperAdmin } from "../middleware/auth/roleMiddleware.js";

const router = express.Router();

/* CREATE STORE + ADMIN */
router.post("/create-store",verifyToken,isSuperAdmin,createStoreWithAdmin);

export default router;