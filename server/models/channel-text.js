import mongoose from "mongoose";

const ChannelTextSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "channel",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models["channel-text"] ||
  mongoose.model("channel-text", ChannelTextSchema);
