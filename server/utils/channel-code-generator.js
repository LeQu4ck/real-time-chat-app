import { v4 as uuidv4 } from "uuid";
import  ChannelSchema  from "~/server/models/channel";

const generateChannelUniqueCode = async () => {
  let code, exists;

  do {
    code = generateCode();
    exists = await ChannelSchema.exists({ uniqueJoinCode: code });
  } while (exists);

  return code;
};

const generateCode = () => {
  return uuidv4().slice(14, 36);
};

export default generateChannelUniqueCode;