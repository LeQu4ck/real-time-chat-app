import { defineMongooseModel } from "#nuxt/mongoose";
import mongoose from "mongoose";

export const ChannelSchema = defineMongooseModel({
  name: "channel",

  schema: {
    name: { type: String, required: true },
    description: String,

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
});