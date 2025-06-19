import { defineEventHandler, createError, getCookie } from "h3";
import jwt from "jsonwebtoken";
import { ChannelMembershipSchema } from "~/server/models/channel-membership";

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

  try {
    const userChannelsMembership = await ChannelMembershipSchema.find({ userId })
      .populate("channelId", "name description")
      .lean();

    const channels = userChannelsMembership.map((m) => ({
      channelId: m.channelId._id,
      channelName: m.channelId.name,
    }));

    return {
      success: true,
      channels,
    };
  } catch {
    return createError({
      statusCode: 500,
      message: "Failed to fetch user channels",
    });
  }
});
