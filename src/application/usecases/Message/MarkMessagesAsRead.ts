import { IMessageRepository, toDomainMessage } from "../../../domain/repositories/IMessageRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";

export class MarkMessagesAsRead {
  constructor(
    private messageRepository: IMessageRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(userId: string, targetId: string, isGroup: boolean): Promise<void> {
    let messages = [];

    const senderPhoto = (await this.userRepository.findById(userId))?.photo || "";



    if (isGroup) {
      // Tous les messages de groupe où userId est destinataire dans ce groupe
      messages = await this.messageRepository.getMessageUserGroup(userId, targetId);
    } else {
      // Tous les messages privés entre userId et targetId
      messages = await this.messageRepository.findMessagesBetweenUsers(userId, targetId);
      messages = messages.map(toDomainMessage)
    }

    //messages = messages.map(toDomainMessage)

    for (const message of messages) {
      if (isGroup) {
        if (!message.readBy) message.readBy = [];
      
        const hasRead = message.readBy.some(entry => entry.userId.toString() === userId);
        

        if (!hasRead && message.id) {
          const messageTimestamp = new Date(message.timestamp);
      
          // ✅ Filtrer tous les messages postérieurs à celui-ci (y compris lui-même)

          const allMessagesGroup = await this.messageRepository.findByIdGroup(targetId)
          const lastDate = (await this.messageRepository.findLastMessageGroupForUser(userId)).timestamp
          console.log(allMessagesGroup)
          
          console.log("last date : ",lastDate)
          const unreadMessages = allMessagesGroup.filter(m =>
            new Date(lastDate) >= messageTimestamp &&
            !m.readBy?.some(entry => entry.userId.toString() === userId)
          );

          console.log(unreadMessages)
      
          for (const msg of unreadMessages) {
            if (!msg.readBy) msg.readBy = [];
      
            msg.readBy.push({ userId, photo: senderPhoto|| "" });
      
            await this.messageRepository.update(msg.id!, { readBy: msg.readBy });
          }
        }
      }
       else {

        if (message.receiverId === userId && !message.read && message.id) {
            await this.messageRepository.update(message.id, { read: true });

        }
      }
    }
  }
}
