import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import superAdminRoutes from "./routes/superadmin.routes.js";
import branchRoutes from "./routes/branch.routes.js";

import { apiLimiter } from "./middleware/rateLimiter.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

//CORE MIDDLEWARE

app.use(cors({
  origin: "http://localhost:3000", // adjust for React later
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// GLOBAL RATE LIMIT

app.use(apiLimiter);

// ROUTES //

app.get("/", (req, res) => {
  res.send("Hardware POS API running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/superadmin", superAdminRoutes);
app.use("/api/branches", branchRoutes);

// ERROR HANDLER (LAST) //

app.use(errorHandler);

export default app;