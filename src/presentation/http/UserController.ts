import express from "express";
import { UserRepositoryImpl } from "../../infrastructure/persistence/UserRepositoryImpl";
import { CreateUser } from "../../application/usecases/CreateUser";

const router = express.Router();
const repo = new UserRepositoryImpl();
const usecase = new CreateUser(repo);

router.post("/register", async (req, res) => {
  const user = await usecase.execute(req.body);
  res.json(user);
});

export default router;
