import { UserSchema } from "~/server/models/user";
import bcrypt from "bcrypt";
import { setCookie } from "h3";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body;

  const user = await UserSchema.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { statusCode: 401, message: "Invalid credentials" };
  }

  const token = jwt.sign(
    { id: user._id, email: user.email },
    "super_secret_key",
    { expiresIn: "7d" }
  );

  setCookie(event, "token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "Lax",
    path: "/",
  });

  return { success: true, user: { id: user._id, email: user.email } };
});
