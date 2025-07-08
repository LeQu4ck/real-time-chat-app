import { io } from "socket.io-client";

const baseURL = process.env.NUXT_PUBLIC_SOCKET_URL || undefined;

export const socket = io(baseURL, {
  withCredentials: true,
  transports: ["websocket"],
});
