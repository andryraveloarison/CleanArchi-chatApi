import { IMessageRepository } from "../../../domain/repositories/IMessageRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { User } from "../../../domain/entities/User";
import { Message } from "../../../domain/entities/Message";

type UserWithLastMessage = {
  user: Partial<User>;
  lastMessage: Message;
};

export class GetUsersWithLastMessage {
  constructor(
    private messageRepository: IMessageRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(currentUserId: string): Promise<UserWithLastMessage[]> {
    const allMessages = await this.messageRepository.findMessagesInvolvingUser(currentUserId);

    // Créer une map pour stocker le dernier message par utilisateur
    const lastMessageMap: Map<string, Message> = new Map();

    for (const msg of allMessages) {
      const otherUserId =
        msg.senderId === currentUserId ? msg.receiverId : msg.senderId;

      const currentLastMessage = lastMessageMap.get(otherUserId);

      if (
        !currentLastMessage ||
        new Date(msg.timestamp) > new Date(currentLastMessage.timestamp)
      ) {
        lastMessageMap.set(otherUserId, msg);
      }
    }

    const results: UserWithLastMessage[] = [];

    for (const [userId, lastMessage] of lastMessageMap.entries()) {
      const user = await this.userRepository.findById(userId);
      if (user) {
        const { password, key, ...safeUser } = user;
        results.push({ user: safeUser, lastMessage });
      }
    }

    return results;
  }
}
