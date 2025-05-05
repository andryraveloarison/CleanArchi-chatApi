import express from "express";
import { UserRepositoryImpl } from "../../infrastructure/persistence/UserRepositoryImpl";
import { CreateUser } from "../../application/usecases/User/CreateUser";
import { GetAllUsers } from "../../application/usecases/User/GetAllUser";
import { GetOneUser } from "../../application/usecases/User/GetOneUser";
import { LoginUser } from "../../application/usecases/User/LoginUser";

const router = express.Router();
const repo = new UserRepositoryImpl();
const createUser = new CreateUser(repo);
const getAllUsers = new GetAllUsers(repo);
const getOneUser = new GetOneUser(repo);
const loginUser = new LoginUser(repo)


router.post("/register", async (req, res) => {
  const user = await createUser.execute(req.body);
  res.json(user);
});

router.post("/login", async (req, res) => {
  try {
    // Essayer d'exécuter la connexion de l'utilisateur
    const user = await loginUser.execute(req.body.email, req.body.password);
    
    // Si l'utilisateur est trouvé et connecté, envoyer l'utilisateur (sans mot de passe et clé)
    res.json(user);
  } catch (error) {
    // Gérer les erreurs et envoyer une réponse appropriée
  
      // Pour toute autre erreur, renvoyer une erreur générique
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



export default router;
