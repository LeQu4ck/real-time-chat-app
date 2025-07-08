import { defineEventHandler, createError } from "h3";
import  ChannelMembershipSchema  from "~/server/models/channel-membership";
import checkUser from "~/server/utils/check-user";

export default defineEventHandler(async (event) => {
  const user = checkUser(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Not authenticated",
    });
  }

  try {
    const userChannelsMembership = await ChannelMembershipSchema.find({
      userId: user._id,
    })
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
    throw createError({
      statusCode: 500,
      message: "Failed to fetch user channels",
    });
  }
});
