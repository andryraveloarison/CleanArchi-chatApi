export interface Message {
  _id?: string;
  senderId: string;
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
