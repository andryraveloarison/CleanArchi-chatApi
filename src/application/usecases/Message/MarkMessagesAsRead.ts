import { IMessageRepository, toDomainMessage } from "../../../domain/repositories/IMessageRepository";

export class MarkMessagesAsRead {
  constructor(private messageRepository: IMessageRepository) {}

  async execute(userId: string, targetId: string, isGroup: boolean): Promise<void> {
    let messages = [];


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
      
        const senderPhoto = message.senderPhoto || "";
        const hasRead = message.readBy.some(entry => entry.userId.toString() === userId);
      
        if (!hasRead && message.id) {
          const messageTimestamp = new Date(message.timestamp);
      
          // ✅ Filtrer tous les messages postérieurs à celui-ci (y compris lui-même)
          const unreadMessages = messages.filter(m =>
            new Date(m.timestamp) >= messageTimestamp &&
            !m.readBy?.some(entry => entry.userId.toString() === userId)
          );
      
          for (const msg of unreadMessages) {
            if (!msg.readBy) msg.readBy = [];
      
            msg.readBy.push({ userId, photo: senderPhoto });
      
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
