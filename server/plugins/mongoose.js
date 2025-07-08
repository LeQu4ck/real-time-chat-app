import mongoose from "mongoose";

export default defineNitroPlugin(async () => {
  const config = useRuntimeConfig();

  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(config.mongoUri);
      console.log("✅ MongoDB connected");
    } catch (error) {
      console.error("❌ MongoDB connection error:", error);
    }
  }
});
