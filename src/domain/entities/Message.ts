export interface Message {
  id?: string;
  senderId: string;
  senderName?: string;
  receiverId?: string;
  groupId?: string;
  isGroup?: boolean;
  content?: {
    forReceiver: string;
    forSender: string;
  };
  timestamp: Date;
  read?: boolean;
  readBy?: string[];
}
