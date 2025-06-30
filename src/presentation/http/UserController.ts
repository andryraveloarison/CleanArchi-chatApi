import express from "express";
import { UserRepositoryImpl } from "../../infrastructure/persistence/UserRepositoryImpl";
import { CreateUser } from "../../application/usecases/User/CreateUser";
import { GetAllUsers } from "../../application/usecases/User/GetAllUser";
import { GetOneUser } from "../../application/usecases/User/GetOneUser";
import { LoginUser } from "../../application/usecases/User/LoginUser";
import { GetConversations } from "../../application/usecases/User/GetConversations";
import { MessageRepositoryImpl } from "../../infrastructure/persistence/MessageRepositoryImpl";
import { LogoutUser } from "../../application/usecases/User/LogoutUser";
import { GroupRepositoryImpl } from "../../infrastructure/persistence/GroupRepositoryImpl";
import { getIO } from "../../infrastructure/socket/ChatGateway";
import { User } from "../../domain/entities/User";
import { upload } from "../../infrastructure/middleware/upload";

const router = express.Router();
const repo = new UserRepositoryImpl();
const messageRepository = new MessageRepositoryImpl();
const groupRepository = new GroupRepositoryImpl()
const createUser = new CreateUser(repo);
const getAllUsers = new GetAllUsers(repo);
const getOneUser = new GetOneUser(repo);
const loginUser = new LoginUser(repo)
const logoutUser = new LogoutUser(repo)
const getMessagesBetweenUsers = new GetConversations(messageRepository,repo, groupRepository)

router.post("/register", upload.single("photo"), async (req, res) => {
  try {
    const io = getIO();
    const file = req.file;
    const body = req.body;

    const userData = {
      ...body,
      photo: file?.filename, // ou path: `uploads/users/${file?.filename}` si tu veux le chemin complet
    };

    const user = await createUser.execute(userData);
    io.emit("new_user", { user });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'enregistrement" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const io = getIO();
    const user = await loginUser.execute(req.body.email, req.body.password);
    const newUser = user.user as User
    const rep= newUser._id
    io.emit("new_user_connected", {rep}); // ou socket.to(receiverId).emit(...) si tu veux envoyer à un seul utilisateur

    // Si l'utilisateur est trouvé et connecté, envoyer l'utilisateur (sans mot de passe et clé)
    res.json(user);
  } catch (error) {
  
      console.error(error);
      return res.status(500).json({ message: "Une erreur interne est survenue" });
    
  }
});

router.get("/getAll", async (req, res) => {
  const users = await getAllUsers.execute();
  res.json(users);
});

router.get("/getById/:id", async (req, res) => {
  const id = req.params.id
  const users = await getOneUser.execute(id);
  res.json(users);
});


router.get("/getUserMessage/:id", async (req, res) => {
  const id = req.params.id
  const users = await getMessagesBetweenUsers.execute(id);
  res.json(users);
});


router.patch("/logout", async (req, res) => {
  try {
    const userId = req.body.userId; // ou extrait du token s’il y a une auth middleware

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID requis" });
    }
    const io = getIO();

    io.emit("user_disconnect", {userId}); // ou socket.to(receiverId).emit(...) si tu veux envoyer à un seul utilisateur

    const result = await logoutUser.execute(userId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

import { RegenerateKeyPair } from "../../application/usecases/User/RegenerateKeyPair";

const regenerateKeyPair = new RegenerateKeyPair(repo);

router.post("/regenerate-key", async (req, res) => {
  try {
    const { userId, password } = req.body;

    if (!userId || !password) {
      return res.status(400).json({ message: "userId et password requis" , success: false});
    }

    const { privateKey } = await regenerateKeyPair.execute(userId, password);

    return res.json({success:true, privateKey });
  } catch (error: any) {
    return res.status(401).json({ error: error.message, success: false });
  }
});

export default router;
