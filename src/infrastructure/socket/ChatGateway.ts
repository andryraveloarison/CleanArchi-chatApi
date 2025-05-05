import { Server, Socket } from "socket.io";

export const initSocket = (io: Server) => {
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
