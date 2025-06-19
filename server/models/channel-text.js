import mongoose from "mongoose";
import { defineMongooseModel } from "#nuxt/mongoose";

export const ChannelTextSchema = defineMongooseModel({
  name: "channel-text",
  schema: {
    name: { type: String, required: true },
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "channel",
      required: true,
    },
    createdAt: { type: Date, default: () => new Date() },
  },
});
