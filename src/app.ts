import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { connectToDatabase } from "./config/database";
import { initSocket } from "./infrastructure/socket/ChatGateway";
import userRoutes from "./presentation/http/UserController";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

connectToDatabase();
initSocket(io);

app.use(express.json());
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("🚀 Server running on port", PORT));
