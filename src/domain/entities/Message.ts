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
  image: string | null;
  audio: string | null;
  file: string | null;
}


interface ReadBy {
  userId: string,
  photo: string
}
