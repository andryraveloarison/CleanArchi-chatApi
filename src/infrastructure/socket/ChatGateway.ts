import { Server, Socket } from "socket.io";

let io: Server;

export const initSocket = (server: Server) => {
  io = server; // ✅ ici tu assignes à la variable globale

  io.on("connection", (socket: Socket) => {
    console.log("🟢 New client connected:", socket.id);

    socket.on("send_message", (data) => {
      console.log("📨 New message:", data);
      io.emit("receive_message", data);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected:", socket.id);
    });
  });
};

export const getIO = (): Server => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};
