import { ChannelSchema } from "~/server/models/channel";
import { ChannelTextSchema } from "~/server/models/channel-text";
import { ChannelMembershipSchema } from "~/server/models/channel-membership";
import checkUser from "~/server/utils/check-user";
import { defineEventHandler, createError, readBody } from "h3";

export default defineEventHandler(async (event) => {
  const user = checkUser(event);

  if (!user) {
    return createError({
      statusCode: 401,
      message: "Not authenticated",
    });
  }

  const { name, description } = await readBody(event);

  console.log(name, description);

  if (!name) {
    return createError({
      statusCode: 400,
      message: "Channel name is required",
    });
  }
  let newChannel = null;
  try {
    newChannel = await ChannelSchema.create({
      name,
      description,
      owner: user.id,
    });

    await ChannelTextSchema.create({
      name: "general",
      channelId: newChannel._id,
    });

    await ChannelMembershipSchema.create({
      userId: user.id,
      channelId: newChannel._id,
      channelRole: "owner",
    });

    return { success: true, channel: newChannel };
  } catch {
    if (newChannel?._id) {
      await ChannelSchema.deleteOne({ _id: newChannel._id });
      await ChannelTextSchema.deleteMany({ channelId: newChannel._id });
      await ChannelMembershipSchema.deleteMany({ channelId: newChannel._id });
    }

    return createError({
      statusCode: 500,
      message: "Failed to create channel and its dependencies",
    });
  }
});
