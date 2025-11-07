import mongoose from "mongoose";
import { envVariable } from "./config";
import app from ".";

async function server() {
  try {
    // Connect to MongoDB
    await mongoose.connect(envVariable.MONGO_URI as string);
    console.log("🛢 Database connected");

    // Start Express app directly (no Socket.IO)
    app.listen(envVariable.PORT, () => {
      console.log(`🚀 Auth service listening on port ${envVariable.PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to database", error);
    process.exit(1);
  }
}

server();
