import  ChannelSchema  from "~/server/models/channel"

export default defineEventHandler(async () => {

  const channels = await ChannelSchema.find().sort({ createdAt: -1 })
  return channels
})