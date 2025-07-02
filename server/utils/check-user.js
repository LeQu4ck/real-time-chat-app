import { getCookie } from "h3";
import jwt from "jsonwebtoken";

const checkUser = (event) => {
  const token = getCookie(event, "token");
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

export default checkUser;