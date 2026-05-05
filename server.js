import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import { runInitSql } from "./src/seed/runInitSql.js";
import seedSuperAdmin from "./src/seed/seedAdmin.js";

const PORT = process.env.PORT || 5000;

/* ======================
   START SERVER
====================== */
const startServer = async () => {
  try {
    // 1. init DB schema
    await runInitSql();

    // 2. seed super admin
    await seedSuperAdmin();

    // 3. start server AFTER setup
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
  }
};

startServer();