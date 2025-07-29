import checkUser from "~/server/utils/check-user";
import ChannelMessageSchema  from "~/server/models/channel-message";
import { defineEventHandler, createError, getRouterParam } from "h3";

export default defineEventHandler(async (event) => {
  const user = await checkUser(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Not authenticated",
    });
  }

  const textChannelId = getRouterParam(event, "channel-messages");

  //console.log(textChannelId);

  const { before } = getQuery(event);

  const limit = 20;
  const query = { channelTextId: textChannelId };

  if (before) {
    query.createdAt = { $lt: new Date(before) };
  }

  try {
    const textChannelMessages = await ChannelMessageSchema.find(query)
      .populate("senderId", "_id email")
      .lean()
      .sort({ createdAt: -1 })
      .limit(limit);

    return {
      success: true,
      messages: textChannelMessages.reverse(),
    };
  } catch {
    console.error("Failed to fetch channel messages");

    throw createError({
      statusCode: 500,
      message: "Failed to fetch channel messages",
    });
  }
});
