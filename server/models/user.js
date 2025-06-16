import { defineMongooseModel } from "#nuxt/mongoose";

export const UserSchema = defineMongooseModel({
  name: "user",

  schema: {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },

  timestamps: true,
});
