import mongoose from "mongoose";
import { defineMongooseModel } from "#nuxt/mongoose";

export const ChannelMessageSchema = defineMongooseModel({
  name: "channel-message",
  schema: {
    messageBody: { type: String, required: true },
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "channel",
      required: true,
    },
    createdAt: { type: Date, default: () => new Date() },
    updatedAt: { type: Date, default: () => new Date() },
  },
});
