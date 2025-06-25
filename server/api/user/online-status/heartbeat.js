import { defineEventHandler, createError, getCookie } from "h3";
import jwt from "jsonwebtoken";

const onlineUsers = new Map();

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

  const userId = decoded.id;
  onlineUsers.set(userId, Date.now());

  console.log("Online users: ", Array.from(onlineUsers.keys()));

  return { success: true };
});

globalThis.onlineUsers = onlineUsers;