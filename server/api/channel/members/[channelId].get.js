import { ChannelMembershipSchema } from "~/server/models/channel-membership";
//import { UserSchema } from "~/server/models/user";
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
    return createError({ statusCode: 403, message: "Unauthorized" });
  }
  if (!decoded) {
    return createError({ statusCode: 403, message: "Unauthorized" });
  }
  const channelId = getRouterParam(event, "channelId");
  const onlineUsers = event.context.onlineUsers || new Map();

  try {
    const memberships = await ChannelMembershipSchema.find({
      channelId: channelId,
    })
      .populate("userId", "_id email avatar")
      .lean();

    if (!memberships || memberships.length === 0) {
      return createError({
        statusCode: 403,
        statusMessage: "Not authorized to see members of this channel",
      });
    }

    const grouped = {};

    memberships.forEach((member) => {
      const role = member.channelRole || "member";

      if (!grouped[role]) grouped[role] = [];

      grouped[role].push({
        id: member.userId._id,
        email: member.userId.email,
        status: onlineUsers.has(member.userId._id.toString())
          ? "online"
          : "offline",
      });
    });

    return { success: true, members: grouped };
  } catch {
    return createError({
      statusCode: 500,
      message: "Failed to fetch channel members",
    });
  }
});
