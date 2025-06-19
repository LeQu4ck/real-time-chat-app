import { ChannelSchema } from "~/server/models/channel";
import { ChannelTextSchema } from "~/server/models/channel-text";
import { ChannelMembershipSchema } from "~/server/models/channel-membership";
import { getCookie } from "h3";
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
    return createError({ statusCode: 403, message: "Invalid token" });
  }

  const body = await readBody(event);
  const { name, description } = body;

  if (!name) {
    return {
      statusCode: 400,
      message: "Channel name is required",
    };
  }

  const userId = decoded.id;

  let newChannel = null;

  try {
    newChannel = await ChannelSchema.create({
      name,
      description,
      owner: userId,
    });

    await ChannelTextSchema.create({
      name: "general",
      channelId: newChannel._id,
    });

    await ChannelMembershipSchema.create({
      userId,
      channelId: newChannel._id,
      channelRole: "owner",
    });

    return { success: true, channel: newChannel };
  } catch {
    if (newChannel?._id) {
      await ChannelSchema.deleteOne({ _id: newChannel._id });
      await ChannelText.deleteMany({ channelId: newChannel._id });
      await ChannelMembershipSchema.deleteMany({ channelId: newChannel._id });
    }

    return createError({
      statusCode: 500,
      message: "Failed to create channel and its dependencies",
    });
  }
});
