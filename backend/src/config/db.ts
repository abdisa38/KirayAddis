import mongoose from "mongoose";
import dns from "node:dns";

// Fix for Windows DNS SRV resolution on MongoDB Atlas
try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (e) {}

export const connectDB = async (): Promise<void> => {
  const connUri = process.env.MONGO_URI;
  if (!connUri) {
    throw new Error("MONGO_URI environment variable is not defined.");
  }

  let connected = false;
  let attempts = 0;
  while (!connected && attempts < 5) {
    attempts++;
    try {
      const conn = await mongoose.connect(connUri, {
        serverSelectionTimeoutMS: 20000,
        connectTimeoutMS: 20000,
      });
      connected = true;
      console.log(`[MongoDB] Connected successfully to Atlas: ${conn.connection.host}/${conn.connection.name}`);
    } catch (error) {
      console.error(`[MongoDB] Connection attempt ${attempts} failed:`, error);
      if (attempts >= 5) throw error;
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
};
