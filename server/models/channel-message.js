import mongoose from "mongoose";

const ChannelMessageSchema = new mongoose.Schema(
  {
    messageBody: { type: String, required: true },
    messageType: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text",
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    channelTextId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "channel-text",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models["channel-message"] ||
  mongoose.model("channel-message", ChannelMessageSchema);
