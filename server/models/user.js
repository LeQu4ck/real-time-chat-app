import { defineMongooseModel } from "#nuxt/mongoose";

export const UserSchema = new defineMongooseModel({
  name: "user",

  schema: {
    email: String,
    password: String,

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
});
