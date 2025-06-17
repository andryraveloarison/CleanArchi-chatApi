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

router.post("/register", async (req, res) => {
  const user = await createUser.execute(req.body);
  res.json(user);
});

router.post("/login", async (req, res) => {
  try {
    const user = await loginUser.execute(req.body.email, req.body.password);
    
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

    const result = await logoutUser.execute(userId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});


export default router;
