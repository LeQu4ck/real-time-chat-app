import checkUser from "~/server/utils/check-user";
import  ChannelSchema  from "~/server/models/channel";

export default defineEventHandler(async (event) => {
  const user = await checkUser(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Not authenticated",
    });
  }

  const channelId = getRouterParam(event, "channel-basic-info");
  //console.log(channelId);

  try {
    const channel = await ChannelSchema.find({
      _id: channelId,
    }).select("_id name description uniqueJoinCode");

    return { success: true, channel: channel[0] };
  } catch {
    throw createError({
      statusCode: 500,
      message: "Error on fetching channel",
    });
  }
});
