import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import tenantRoutes from "./routes/tenantRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Security and HTTP Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Root Healthcheck API
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    service: "Addis Kiray API",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/tenant", tenantRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);

// Centralized Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[Addis Kiray API] Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
  console.log(`[Addis Kiray API] Healthcheck: http://localhost:${PORT}/api/health`);
});
