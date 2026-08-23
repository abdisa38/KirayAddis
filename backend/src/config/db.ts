import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const connUri = process.env.MONGO_URI;
    if (!connUri) {
      throw new Error("MONGO_URI environment variable is not defined.");
    }

    const conn = await mongoose.connect(connUri);
    console.log(`[MongoDB] Connected successfully to Atlas: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error("[MongoDB] Connection Error:", error);
    process.exit(1);
  }
};
