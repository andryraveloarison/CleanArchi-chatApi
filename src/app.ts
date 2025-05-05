import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { connectToDatabase } from "./config/database";
import { initSocket } from "./infrastructure/socket/ChatGateway";
import userRoutes from "./presentation/http/UserController";
import messageRoutes from "./presentation/http/MessageController";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors({
    origin: "*", // Remplacez par l'URL de votre frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Méthodes autorisées
    allowedHeaders: ["Content-Type", "Authorization"] // En-têtes autorisés
}));


const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

connectToDatabase();
initSocket(io);

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/message", messageRoutes);


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("🚀 Server running on port", PORT));
