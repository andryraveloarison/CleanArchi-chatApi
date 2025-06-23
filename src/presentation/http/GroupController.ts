import express from "express";
import { GroupRepositoryImpl } from "../../infrastructure/persistence/GroupRepositoryImpl";

const router = express.Router();
const groupRepo = new GroupRepositoryImpl();

// Créer un groupe
router.post("/create", async (req, res) => {
  try {
    const { name, members } = req.body;
    const group = await groupRepo.create(name, members);
    res.status(201).json(group);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Ajouter un membre
router.post("/:groupId/add-member", async (req, res) => {
  try {
    const { groupId } = req.params;
    const { memberId } = req.body;
    const updatedGroup = await groupRepo.addMember(groupId, memberId);
    res.status(200).json(updatedGroup);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Supprimer un membre
router.post("/:groupId/remove-member", async (req, res) => {
  try {
    const { groupId } = req.params;
    const { memberId } = req.body;
    const updatedGroup = await groupRepo.removeMember(groupId, memberId);
    res.status(200).json(updatedGroup);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Obtenir un groupe + RENVOYER NOM MEMBRE
router.get("/:groupId", async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await groupRepo.findById(groupId);
    res.status(200).json(group);
  } catch (err: any) {
    res.status(404).json({ error: "Groupe non trouvé" });
  }
});

export default router;
