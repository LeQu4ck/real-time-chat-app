import mongoose from "mongoose";
import { defineMongooseModel } from "#nuxt/mongoose";

export const ChannelMessageSchema = defineMongooseModel({
  name: "channel-message",

  schema: {
    messageBody: { type: String, required: true },
    messageType:{
        
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

  options: {
    timestamps: true,
  },
});
