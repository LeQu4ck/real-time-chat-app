import checkUser from "~/server/utils/check-user";
import { ChannelMessageSchema } from "~/server/models/channel-message";
import { ChannelMembershipSchema } from "~/server/models/channel-membership";
import { ChannelTextSchema } from "~/server/models/channel-text";
import { defineEventHandler, createError, readBody } from "h3";

export default defineEventHandler(async (event) => {
  const user = checkUser(event);

  if (!user) {
    throw createError({ statusCode: 401, message: "Not authenticated" });
  }

  const body = await readBody(event);
  const { channelId, channelTextId, content } = body;

  console.log(channelTextId, content);
  if (!channelTextId || !content) {
    throw createError({ statusCode: 400, message: "Missing fields" });
  }

  const isUserJoined = await ChannelMembershipSchema.findOne({
    userId: user._id,
    channelId: channelId,
  });

  if (!isUserJoined) {
    throw createError({ statusCode: 403, message: "Not authorized" });
  }

  const hasChannelTextChannel = await ChannelTextSchema.findOne({
    _id: channelTextId,
    channelId: channelId,
  });

  if (!hasChannelTextChannel) {
    throw createError({ statusCode: 403, message: "Not authorized" });
  }

  const message = await ChannelMessageSchema.create({
    messageBody: content,
    messageType: "text",
    senderId: user._id,
    channelTextId,
  });

  const messageWithUserInfo = await ChannelMessageSchema.findById(message._id)
    .populate("senderId", "_id email")
    .lean();

  const io = useNitroApp().io;
  io.to(`text-channel:${channelTextId}`).emit(
    "text-channel:message",
    messageWithUserInfo
  );

  return { success: true, messageWithUserInfo };
});
