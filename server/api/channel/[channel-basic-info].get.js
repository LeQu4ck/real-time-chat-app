import checkUser from "~/server/utils/check-user";
import { ChannelSchema } from "~/server/models/channel";

export default defineEventHandler(async (event) => {
  const user = checkUser(event);

  if (!user) {
    return createError({
      statusCode: 401,
      message: "Not authenticated",
    });
  }

  const channelId = getRouterParam(event, "channel-basic-info");
  //console.log(channelId);

  try {
    const channel = await ChannelSchema.find({
      _id: channelId,
    }).select("_id name description");

    return { success: true, channel: channel[0] };
  } catch {
    return createError({
      statusCode: 500,
      message: "Error on fetching channel",
    });
  }
});
