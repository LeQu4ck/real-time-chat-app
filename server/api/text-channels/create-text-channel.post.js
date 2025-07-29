import checkUser from "~/server/utils/check-user";
import ChannelMembershipSchema from "~/server/models/channel-membership";
import ChannelTextSchema from "~/server/models/channel-text";
import { defineEventHandler, createError, readBody } from "h3";

export default defineEventHandler(async (event) => {
  const user = await checkUser(event);

  if (!user) {
    throw createError({ statusCode: 401, message: "Not authenticated" });
  }

  const body = await readBody(event);
  const { channelId, content } = body;

  if (!channelId || !content) {
    throw createError({ statusCode: 400, message: "Missing fields" });
  }

  const isUserJoined = await ChannelMembershipSchema.findOne({
    userId: user._id,
    channelId: channelId,
  });

  if (!isUserJoined) {
    throw createError({ statusCode: 403, message: "Not authorized" });
  }

  const isUserAllowedToCreateTextChannel =
    isUserJoined.channelRole === "owner" ||
    isUserJoined.channelRole === "admin";

  if (!isUserAllowedToCreateTextChannel) {
    throw createError({
      statusCode: 403,
      message: "User does not have permission to create text channels.",
    });
  }

  try {
    const newTextChannel = await ChannelTextSchema.create({
      name: content,
      channelId: channelId,
    });

    return { success: true, statusCode: 201, textChannel: newTextChannel };
  } catch {
    throw createError({
      statusCode: 500,
      message: "Intenal server error.",
    });
  }
});
