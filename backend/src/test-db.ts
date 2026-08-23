import mongoose from "mongoose";

const directUri =
  "mongodb://abdisaawel313_db_user:zWQVXBcMg2044HCw@ac-ykchcsw-shard-00-00.ovb8kel.mongodb.net:27017,ac-ykchcsw-shard-00-01.ovb8kel.mongodb.net:27017,ac-ykchcsw-shard-00-02.ovb8kel.mongodb.net:27017/addis_kiray?ssl=true&authSource=admin&retryWrites=true&w=majority";

async function testDirect() {
  try {
    console.log("[Test] Connecting via direct standard URI...");
    const conn = await mongoose.connect(directUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("✅ SUCCESS! Connected to MongoDB Atlas host:", conn.connection.host);
    process.exit(0);
  } catch (err: any) {
    console.error("❌ Connection Error:", err.name, err.message);
    process.exit(1);
  }
}

testDirect();
