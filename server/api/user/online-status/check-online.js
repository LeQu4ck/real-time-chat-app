// export default defineEventHandler(async (event) => {
//   const activeUsers = [];
//   const onlineUsers = globalThis.heartbeatOnlineUsers || new Map();
//   const now = Date.now();

//   for (const [userId, lastSeen] of onlineUsers.entries()) {
//     if (now - lastSeen <= 90000) {
//       activeUsers.push(userId);
//     }
//   }

//   return {
//     success: true,
//     onlineUsers: activeUsers,
//   };
// });