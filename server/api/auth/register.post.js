import { UserSchema } from "~/server/models/user";
import bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { email, password } = body;

  if (!email || !password) {
    return { statusCode: 400, message: "Missing fields" };
  }

  const existing = await UserSchema.findOne({ email });
  if (existing) {
    return { statusCode: 409, message: "User already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await UserSchema.create({ email, password: hashedPassword });

  return { success: true, user: { id: user._id, username: user.username } };
});