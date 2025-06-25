import { getCookie } from "h3";
import jwt from "jsonwebtoken";
import { ChannelSchema } from "~/server/models/channel";

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
