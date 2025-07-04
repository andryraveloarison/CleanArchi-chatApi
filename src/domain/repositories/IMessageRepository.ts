import { Message } from "../entities/Message";


export function toDomainMessage(doc: any): Message {

  return {
    id: doc._id.toString(),
    senderId: doc.senderId._id?.toString?.() ?? doc.senderId.toString(),
    senderName: doc.senderId.username ?? null, // ← inclus ici
    senderPhoto: doc.senderId.photo ?? null,
    receiverId: doc.receiverId,
    groupId: doc.groupId,
    isGroup: doc.isGroup,
    content: doc.content,
    timestamp: doc.timestamp,
    read: doc.read,
    readBy: doc.readBy,
    image: doc.image,
    audio: doc.audio,
    file: doc.file
  };
}

export interface IMessageRepository {
  save(message: Message): Promise<Message>;
  getAll(): Promise<Message[]>;
  findMessagesBetweenUsers(userId1: string, userId2: string): Promise<Message[]>
  getMessageUserGroup(userId: string, groupId: string): Promise<Message[]>;
  findMessagesInvolvingUser(userId: string): Promise<Message[]>;
  findById(id: string): Promise<Message | null>;
  update(id: string, data: Partial<Message>): Promise<Message | null>;
  findByIdGroup(groupId: string): Promise<Message[]>;
  findLastMessageGroupForUser(userId: string): Promise<Message>;

}
