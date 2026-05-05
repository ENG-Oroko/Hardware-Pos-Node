import express from "express";
import { createStoreWithAdmin } from "../controllers/superadmin/admin.store.js";

import { verifyToken } from "../middleware/auth/authMiddleware.js";
import { isSuperAdmin } from "../middleware/auth/roleMiddleware.js";
import { validateStore } from "../middleware/store/validateStore.js";
import { createStoreLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post(
  "/create-store",
  createStoreLimiter,
  verifyToken,
  isSuperAdmin,
  validateStore,
  createStoreWithAdmin
);

export default router;