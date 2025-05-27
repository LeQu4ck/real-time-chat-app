import { ChannelSchema } from "~/server/models/channel";

export default defineEventHandler(async (event) => {
  const io = event.context.io;

  if (!io) {
    return {
      statusCode: 500,
      message: "Socket.io is not initialized",
    };
  }

  const body = await readBody(event);
  const { name, description } = body;

  if (!name) {
    return {
      statusCode: 400,
      message: "Channel name is required",
    };
  }

  const newChannel = await ChannelSchema.create({ name, description });

  //console.log(io);
  if (io) {
    io.emit("channel:new", newChannel);
  }

  return { success: true, channel: newChannel };
});
