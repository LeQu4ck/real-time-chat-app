import { ChannelSchema } from "~/server/models/channel";
import { ChannelTextSchema } from "~/server/models/channel-text";
import { ChannelMembershipSchema } from "~/server/models/channel-membership";
import checkUser from "~/server/utils/check-user";
import { defineEventHandler, createError, readBody } from "h3";
import generateChannelUniqueCode from "~/server/utils/channel-code-generator";

export default defineEventHandler(async (event) => {
  const user = checkUser(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Not authenticated",
    });
  }

  const { name, description } = await readBody(event);

  console.log(name, description);

  if (!name) {
    throw createError({
      statusCode: 400,
      message: "Channel name is required",
    });
  }
  let newChannel = null;
  try {
    const uniqueJoinCode = await generateChannelUniqueCode();

    newChannel = await ChannelSchema.create({
      name,
      description,
      owner: user._id,
      uniqueJoinCode,
    });

    await ChannelTextSchema.create({
      name: "general",
      channelId: newChannel._id,
    });

    await ChannelMembershipSchema.create({
      userId: user._id,
      channelId: newChannel._id,
      channelRole: "owner",
    });

    return { success: true, statusCode: 201, channel: newChannel };
  } catch {
    if (newChannel?._id) {
      await ChannelSchema.deleteOne({ _id: newChannel._id });
      await ChannelTextSchema.deleteMany({ channelId: newChannel._id });
      await ChannelMembershipSchema.deleteMany({ channelId: newChannel._id });
    }

    throw createError({
      statusCode: 500,
      message: "Failed to create channel and its dependencies",
    });
  }
});
