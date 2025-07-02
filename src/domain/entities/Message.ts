export interface Message {
  id?: string;
  senderId: string;
  senderName?: string;
  senderPhoto?: string;
  receiverId?: string;
  groupId?: string;
  isGroup?: boolean;
  content?: {
    forReceiver: string;
    forSender: string;
  };
  timestamp: Date;
  read?: boolean;
  readBy?: ReadBy[];
}


interface ReadBy {
  userId: string,
  photo: string
}
