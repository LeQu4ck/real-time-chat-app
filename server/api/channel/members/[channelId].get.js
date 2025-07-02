import { ChannelMembershipSchema } from "~/server/models/channel-membership";
import checkUser from "~/server/utils/check-user";
//import { UserSchema } from "~/server/models/user";

export default defineEventHandler(async (event) => {
  const user = checkUser(event);

  if (!user) {
    return createError({
      statusCode: 401,
      message: "Not authenticated",
    });
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
