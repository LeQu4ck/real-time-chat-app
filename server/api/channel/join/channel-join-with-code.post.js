import { ChannelMembershipSchema } from "~/server/models/channel-membership";
import { ChannelSchema } from "~/server/models/channel";
import checkUser from "~/server/utils/check-user";
import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  const user = checkUser(event);

  if (!user) {
    throw createError({ statusCode: 401, message: "Not authenticated" });
  }

  const body = await readBody(event);

  const { channelCode } = body;
  //41fa-b344-5707022979f5

  if (!channelCode) {
    throw createError({ statusCode: 400, message: "Not found" });
  }

  try {
    const channel = await ChannelSchema.findOne({
      uniqueJoinCode: channelCode,
    });

    if (!channel) {
      throw createError({ statusCode: 404, message: "Not found" });
    }

    const isUserJoined = await ChannelMembershipSchema.findOne({
      channelId: channel._id,
      userId: user._id,
    });

    if (isUserJoined) {
      throw createError({
        statusCode: 409,
        message: "Already member of this channel",
      });
    }

    const channelMembership = await ChannelMembershipSchema.create({
      userId: user._id,
      channelId: channel._id,
    });

    return {
      success: true,
      statusCode: 201,
      channelMembership,
    };
  } catch {
    throw createError({ statusCode: 500, message: "Internal server error" });
  }
});