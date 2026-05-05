import fs from "fs";
import path from "path";
import db from "../config/db.js";

export const runInitSql = async () => {
  try {
    const filePath = path.resolve("src/db/init.sql");

    const sql = fs.readFileSync(filePath, "utf8");

    await db.query(sql);

    console.log("🟢 Database schema loaded successfully");

  } catch (err) {
    console.error("🔴 Failed to load init.sql:", err.message);
  }
};