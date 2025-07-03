import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { connectToDatabase } from "./config/database";
import { initSocket } from "./infrastructure/socket/ChatGateway";
import userRoutes from "./presentation/http/UserController";
import messageRoutes from "./presentation/http/MessageController";
import groupRoutes from "./presentation/http/GroupController"
import cors from "cors";
import morgan from "morgan"; // Import Morgan
import path from "path";

dotenv.config();
const app = express();
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/uploads/messages", express.static("uploads/messages"));

app.use(morgan("dev"));
app.use(cors({
    origin: "http://localhost:5173", // Remplacez par l'URL de votre frontend
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Méthodes autorisées
    allowedHeaders: ["Content-Type", "Authorization"] // En-têtes autorisés
}));


const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

connectToDatabase();
initSocket(io);

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/group", groupRoutes);


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("🚀 Server running on port", PORT));
