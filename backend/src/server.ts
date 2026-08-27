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
app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    crossOriginEmbedderPolicy: false,
  })
);
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

// Root Landing & Healthcheck API
app.get("/", (req: Request, res: Response) => {
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Addis Kiray API — Online</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #f0f7f5; color: #11355b; }
          .card { background: white; padding: 40px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.06); text-align: center; max-width: 500px; width: 90%; }
          h1 { color: #0b8879; margin: 12px 0 8px; font-size: 24px; }
          p { color: #526f84; font-size: 14px; line-height: 1.6; margin: 0 0 16px; }
          .badge { display: inline-block; background: #e3f7f2; color: #075e53; padding: 6px 16px; border-radius: 99px; font-weight: 700; font-size: 12px; }
          .links { display: flex; gap: 10px; justify-content: center; margin-top: 20px; }
          .links a { background: #0b8879; color: #ffffff; text-decoration: none; font-weight: 700; padding: 8px 16px; border-radius: 8px; font-size: 12px; }
          .links a.sec { background: #f0f5f7; color: #173858; }
        </style>
      </head>
      <body>
        <div class="card">
          <span class="badge">● Backend API Live & Connected</span>
          <h1>Addis Kiray REST API</h1>
          <p>The backend service for Addis Kiray is operational and connected to MongoDB Atlas.</p>
          <p style="font-size: 12px; color: #738b9c;">This server provides REST APIs for the React frontend on Vercel.</p>
          <div class="links">
            <a href="/api/health">Check API Health</a>
            <a href="/api/properties" class="sec">View Properties JSON</a>
          </div>
        </div>
      </body>
    </html>
  `);
});

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
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[Addis Kiray API] Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
    console.log(`[Addis Kiray API] Healthcheck: http://localhost:${PORT}/api/health`);
  });
};

startServer();
