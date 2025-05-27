import { defineMongooseModel } from "#nuxt/mongoose";

export const ChannelSchema = defineMongooseModel({
  name: "channel",

  schema: {
    name: { type: String, required: true },
    description: String,
    createdAt: { type: Date, default: Date.now },
  },
});
