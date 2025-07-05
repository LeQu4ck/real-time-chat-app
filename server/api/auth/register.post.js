import { UserSchema } from "~/server/models/user";
import { defineEventHandler, readBody } from "h3";
import bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { email, password } = body;

  if (!email || !password) {
    throw createError({ statusCode: 400, message: "Missing fields" });
  }

  const existing = await UserSchema.findOne({ email });
  if (existing) {
    throw createError({ statusCode: 409, message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await UserSchema.create({ email, password: hashedPassword });

  return { success: true, user: { id: user._id, username: user.username } };
});
