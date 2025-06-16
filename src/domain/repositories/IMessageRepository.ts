import { Message } from "../entities/Message";

export interface IMessageRepository {
  save(message: Message): Promise<Message>;
  getAll(): Promise<Message[]>;
  findMessagesBetweenUsers(userId1: string, userId2: string): Promise<Message[]>
  findMessagesInvolvingUser(userId: string): Promise<Message[]>;

}
