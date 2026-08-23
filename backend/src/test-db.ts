import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "node:dns";

try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (e) {}

dotenv.config();

const test = async () => {
  const uri = process.env.MONGO_URI;
  console.log("Testing connection to:", uri?.replace(/:([^:@]+)@/, ":****@"));
  try {
    const conn = await mongoose.connect(uri || "", {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    console.log("SUCCESS! Connected to host:", conn.connection.host);
    process.exit(0);
  } catch (err: any) {
    console.error("FAIL Reason:", err.name, "-", err.message);
    if (err.reason) {
      console.error("Topology Description:", JSON.stringify(err.reason, null, 2));
    }
    process.exit(1);
  }
};

test();
