import { Server as Engine } from "engine.io";
import { Server } from "socket.io";
import { defineEventHandler } from "h3";
import jwt from "jsonwebtoken";

const onlineUsers = new Map();

export default defineNitroPlugin((nitroApp) => {
  const engine = new Engine();
  const io = new Server(nitroApp.server, {
    cors: {
      origin: "*",
    },
  });

  io.bind(engine);

  nitroApp.io = io;

  io.on("connection", (socket) => {
    console.log("A new client connected:", socket.id);

    const cookieHeader = socket.handshake.headers.cookie || "";
    const token = getCookieFromHeader(cookieHeader, "token");

    let userId = null;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch {
      socket.disconnect();
      return;
    }

    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket.id);

    io.emit("user:status", { userId, status: "online" });

    socket.on("user:login", () => {
      io.emit("user:status", { userId, status: "online" });
    });

    socket.on("user:logout", () => {
      const userSockets = onlineUsers.get(userId);
      userSockets?.delete(socket.id);

      if (userSockets?.size === 0) {
        onlineUsers.delete(userId);
        io.emit("user:status", { userId, status: "offline" });
      }

      socket.disconnect();
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
      const userSockets = onlineUsers.get(userId);
      userSockets?.delete(socket.id);
      if (userSockets?.size === 0) {
        onlineUsers.delete(userId);
        io.emit("user:status", { userId, status: "offline" });
      }
    });

    socket.on("text-channel:join", (channelId) => {
      if (!channelId) return;
      socket.join(`text-channel:${channelId}`);
      //console.log(`User ${userId} joined text-channel:${channelId}`);
    });

    socket.on("text-channel:leave", (channelId) => {
      if (!channelId) return;
      socket.leave(`text-channel:${channelId}`);
      //console.log(`User ${userId} left text-channel:${channelId}`);
    });
  });

  nitroApp.hooks.hook("request", (event) => {
    event.context.io = io;
    event.context.onlineUsers = onlineUsers;
  });

  nitroApp.router.use(
    "/socket.io/",
    defineEventHandler({
      handler(event) {
        engine.handleRequest(event.node.req, event.node.res);
        event._handled = true;
      },
      websocket: {
        open(peer) {
          // @ts-expect-error private method and property
          engine.prepare(peer._internal.nodeReq);
          // @ts-expect-error private method and property
          engine.onWebSocket(
            peer._internal.nodeReq,
            peer._internal.nodeReq.socket,
            peer.websocket
          );
        },
      },
    })
  );
});

globalThis.heartbeatOnlineUsers = onlineUsers;

function getCookieFromHeader(cookieHeader, cookieName) {
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(";").map((c) => c.trim());
  for (const cookie of cookies) {
    if (cookie.startsWith(cookieName + "=")) {
      return decodeURIComponent(cookie.substring(cookieName.length + 1));
    }
  }
  return null;
}
