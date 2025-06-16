// server/api/auth/me.get.js
import jwt from "jsonwebtoken";
import { getCookie, getHeader } from "h3";

//const JWT_SECRET = "super_secret_key";

export default defineEventHandler((event) => {
  const authHeader = getHeader(event, "authorization");
  let token = getCookie(event, "token");

  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return { user: null };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { user: decoded };
  } catch {
    return { user: null };
  }
});
