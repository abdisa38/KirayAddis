import mongoose from "mongoose";
import dns from "node:dns";

// Fix for Windows DNS SRV resolution querySrv ECONNREFUSED on MongoDB Atlas
try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (e) {
  // Ignore if not supported
}

export const connectDB = async (): Promise<void> => {
  try {
    const connUri = process.env.MONGO_URI;
    if (!connUri) {
      throw new Error("MONGO_URI environment variable is not defined.");
    }

    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`[MongoDB] Connected successfully to Atlas: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error("[MongoDB] Connection Error:", error);
  }
};
