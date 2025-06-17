import { Message } from "../entities/Message";

export interface IMessageRepository {
  save(message: Message): Promise<Message>;
  getAll(): Promise<Message[]>;
  findMessagesBetweenUsers(userId1: string, userId2: string): Promise<Message[]>
  getMessageUserGroup(userId: string, groupId: string): Promise<Message[]>;
  findMessagesInvolvingUser(userId: string): Promise<Message[]>;
  findById(id: string): Promise<Message | null>;
  update(id: string, data: Partial<Message>): Promise<Message | null>;
}
