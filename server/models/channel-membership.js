import { defineMongooseModel } from "#nuxt/mongoose";
import mongoose from "mongoose";

export const ChannelMembershipSchema = defineMongooseModel({
  name: "channel-membership",

  schema: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "channel",
      required: true,
    },
    channelRole: {
      type: String,
      enum: ["owner", "admin", "member"],
      default: "member",
    },
    joinedAt: {
      type: Date,
      default: () => new Date(),
    },
  },

  options: {
    timestamps: true,
  },
});
