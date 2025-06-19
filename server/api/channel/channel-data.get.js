import { getCookie } from "h3";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  const token = getCookie(event, "token");
  if (!token) {
    return createError({ statusCode: 401, message: "Not authenticated" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return createError({ statusCode: 403, message: "Invalid token" });
  }

  console.log(decoded);
});
