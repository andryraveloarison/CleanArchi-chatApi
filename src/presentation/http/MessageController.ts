import express from "express";
import { UserRepositoryImpl } from "../../infrastructure/persistence/UserRepositoryImpl";
import { MessageRepositoryImpl } from "../../infrastructure/persistence/MessageRepositoryImpl";
import { CreateMessage } from "../../application/usecases/Message/CreateMessage";
import { GetMessagesBetweenUsers } from "../../application/usecases/Message/GetMessagesBetweenUsers";
import { getIO } from "../../infrastructure/socket/ChatGateway";
import { GroupRepositoryImpl } from "../../infrastructure/persistence/GroupRepositoryImpl";
import { GetMessagesByGroupId } from "../../application/usecases/Message/group/GetMessagesByGroupId";
import { MarkMessagesAsRead } from "../../application/usecases/Message/MarkMessagesAsRead";
const router = express.Router();

const userRepo = new UserRepositoryImpl();
const messageRepo = new MessageRepositoryImpl();
const groupRepo = new GroupRepositoryImpl()
const createMessage = new CreateMessage(messageRepo, userRepo, groupRepo);
const getMessagesBetweenUsers = new GetMessagesBetweenUsers(messageRepo);
const getMessagesByGroupId = new GetMessagesByGroupId(messageRepo);
const markMessagesAsRead = new MarkMessagesAsRead(messageRepo)

// POST /messages
router.post("/send", async (req, res) => {
  try {
    const { senderId, receiverId, content, groupId} = req.body;
    const io = getIO();
    const message = await createMessage.execute(senderId, receiverId, content, groupId);
    if(!groupId){
      io.emit("new_message", {senderId,receiverId,message}); // ou socket.to(receiverId).emit(...) si tu veux envoyer à un seul utilisateur
    }else{
      io.emit("group_message", {message})
      console.log("send socket message")
      console.log(message)
    }

    res.status(201).json(message);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});


router.get("/group/:userId/:groupId", async (req, res) => {
  try {
    const { groupId, userId } = req.params;
    const messages = await getMessagesByGroupId.execute(userId, groupId);
    res.status(200).json(messages);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// PUT /messages/read/:userId/:targetId?isGroup=true
router.put("/read/:userId/:targetId", async (req, res) => {
  try {
    console.log("Test")
    const { userId, targetId } = req.params;
    const isGroup = req.query.isGroup === 'true'; // ?isGroup=true

    await markMessagesAsRead.execute(userId, targetId, isGroup);
    res.status(200).json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
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
