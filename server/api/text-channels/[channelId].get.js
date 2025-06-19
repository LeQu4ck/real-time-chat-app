import { getCookie } from "h3";
import jwt from "jsonwebtoken";
import { ChannelTextSchema } from "~/server/models/channel-text";

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

  if (!decoded) {
    return createError({ statusCode: 403, message: "Invalid token" });
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
