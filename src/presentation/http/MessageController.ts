import express from "express";
import { UserRepositoryImpl } from "../../infrastructure/persistence/UserRepositoryImpl";
import { MessageRepositoryImpl } from "../../infrastructure/persistence/MessageRepositoryImpl";
import { CreateMessage } from "../../application/usecases/Message/CreateMessage";
import { GetMessagesBetweenUsers } from "../../application/usecases/Message/GetMessagesBetweenUsers";
const router = express.Router();

const userRepo = new UserRepositoryImpl();
const messageRepo = new MessageRepositoryImpl();

const createMessage = new CreateMessage(messageRepo, userRepo);


const getMessagesBetweenUsers = new GetMessagesBetweenUsers(messageRepo);



// POST /messages
router.post("/send", async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;
    const message = await createMessage.execute(senderId, receiverId, content);
    res.status(201).json(message);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});


// GET /messages/:userId1/:userId2
router.get("/:userId1/:userId2", async (req, res) => {
    try {
      const { userId1, userId2 } = req.params;
      const messages = await getMessagesBetweenUsers.execute(userId1, userId2);
      res.status(200).json(messages);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });



export default router;
