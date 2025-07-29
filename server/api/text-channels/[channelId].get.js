import checkUser from "~/server/utils/check-user";
import  ChannelTextSchema  from "~/server/models/channel-text";

export default defineEventHandler(async (event) => {
  const user = await checkUser(event);

  if (!user) {
    return createError({
      statusCode: 401,
      message: "Not authenticated",
    });
  }

  const channelId = getRouterParam(event, "channelId");
  //console.log(channelId);

  try {
    const textChannels = await ChannelTextSchema.find({
      channelId: channelId,
    })
      .select("_id name")
      .lean();

    return { success: true, textChannels: textChannels };
  } catch {
    return createError({
      statusCode: 500,
      message: "Error on fetching text channels",
    });
  }
});
