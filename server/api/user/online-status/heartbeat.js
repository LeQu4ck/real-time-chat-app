import checkUser from "~/server/utils/check-user";
import { defineEventHandler, createError } from "h3";

const onlineUsers = new Map();

export default defineEventHandler(async (event) => {
  const user = checkUser(event);

  if (!user) {
    return createError({
      statusCode: 401,
      message: "Not authenticated",
    });
  }
  onlineUsers.set(user.id, Date.now());

  console.log("Online users: ", Array.from(onlineUsers.keys()));

  return { success: true };
});

globalThis.onlineUsers = onlineUsers;
