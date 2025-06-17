import { IMessageRepository } from "../../../domain/repositories/IMessageRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IGroupRepository } from "../../../domain/repositories/IGroupRepository";
import { Message } from "../../../domain/entities/Message";
import { User } from "../../../domain/entities/User";
import { Group } from "../../../domain/entities/Group";

type ConversationItem = {
  type: "user" | "group";
  target: Partial<User> | Group;
  lastMessage: Message;
  unreadCount: number;
};

export class GetConversations {
  constructor(
    private messageRepository: IMessageRepository,
    private userRepository: IUserRepository,
    private groupRepository: IGroupRepository
  ) {}
  async execute(currentUserId: string): Promise<{ conversations: ConversationItem[]; unreadConversations: number }> {
    const allMessages = await this.messageRepository.findMessagesInvolvingUser(currentUserId);
    const lastMessagesMap = new Map<string, Message>();
    const unreadCountMap = new Map<string, number>();
  
    for (const msg of allMessages) {
      const key = msg.groupId ?? (msg.senderId === currentUserId ? msg.receiverId : msg.senderId);
  
      const currentLast = lastMessagesMap.get(key || "");
      if (!currentLast || new Date(msg.timestamp) > new Date(currentLast.timestamp)) {
        lastMessagesMap.set(key || "", msg);
      }
  
      if (msg.groupId) {
        if (!msg.readBy?.includes(currentUserId)) {
          unreadCountMap.set(key || "", (unreadCountMap.get(key || "") || 0) + 1);
        }
      } else if (msg.receiverId === currentUserId && !msg.read) {
        unreadCountMap.set(key || "", (unreadCountMap.get(key || "") || 0) + 1);
      }
    }
  
    const results: ConversationItem[] = [];
    let unreadConversations = 0; // ✅ compteur global
  
    for (const [key, lastMessage] of lastMessagesMap.entries()) {
      const unreadCount = unreadCountMap.get(key) || 0;
      if (unreadCount > 0) unreadConversations++; // ✅ incrément si non lu
  
      if (lastMessage.groupId) {
        const group = await this.groupRepository.findById(lastMessage.groupId);
        if (group) {
          results.push({ type: "group", target: group, lastMessage, unreadCount });
        }
      } else {
        const user = await this.userRepository.findById(key);
        if (user) {
          const { password, key: _key, ...safeUser } = user;
          results.push({
            type: "user",
            target: {
              id: user.id,
              email: user.email,
              username: user.username,
              online: user.online,
            },
            lastMessage,
            unreadCount,
          });
        }
      }
    }
  
    return {
      conversations: results,
      unreadConversations,
    };
  }
  
}
