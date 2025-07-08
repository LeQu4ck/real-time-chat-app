import mongoose from "mongoose";

const ChannelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    uniqueJoinCode: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models["channel"] || mongoose.model("channel", ChannelSchema);
