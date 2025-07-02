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
    }

    //messages = messages.map(toDomainMessage)


    for (const message of messages) {
      if (isGroup) {
        if (!message.readBy) message.readBy = [];
        try {

        
        if (!message.readBy.includes(userId) && message.id) {
          message.readBy.push(userId);
            await this.messageRepository.update(message.id, { readBy: message.readBy });          
        }

      }catch(err: any){
        console.log(err)
      }

      } else {
        // message privé → userId doit être le destinataire

        if (message.receiverId === targetId && !message.read && message.id) {
            await this.messageRepository.update(message.id, { read: true });
        }
      }
    }
  }
}
