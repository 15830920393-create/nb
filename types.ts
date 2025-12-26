
export enum TabType {
  CHATS = 'chats',
  CONTACTS = 'contacts',
  DISCOVER = 'discover',
  ME = 'me'
}

export type SubViewType = 
  | 'moments' | 'pay' | 'settings' | 'none' | 'channels' | 'wallet-detail' 
  | 'stickers' | 'search' | 'scan' | 'shake' | 'status-picker' 
  | 'add-friend' | 'game' | 'bank-cards' | 'add-card'
  | 'transfer' | 'payment-code' | 'receipt-code' | 'profile-settings' | 'post-moment'
  | 'contact-detail' | 'edit-remark-tags' | 'voice-call' | 'privacy-settings'
  | 'image-viewer';

export type MessageType = 'text' | 'image' | 'voice' | 'red-packet' | 'system' | 'transfer';
export type MessageStatus = 'sending' | 'sent' | 'read' | 'failed';

export interface Message {
  id: string;
  senderId: string;
  text?: string;
  type: MessageType;
  timestamp: number;
  isMe: boolean;
  status?: MessageStatus;
  duration?: number; // for voice
  amount?: string;   // for red-packet/transfer
  isOpened?: boolean; // for red-packet
  isReceived?: boolean; // for transfer
  isRecalled?: boolean; // for recalled messages
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  messages: Message[];
  isAI?: boolean;
}

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  remark?: string;
  tags?: string[];
  status?: string;
  isOfficial?: boolean;
  isBlocked?: boolean;
  hideMyMoments?: boolean;
}

export interface BankCard {
  id: string;
  bankName: string;
  cardNumber: string;
  type: 'Credit' | 'Debit';
  color: string;
}

export interface Comment {
  author: string;
  text: string;
  to?: string; 
}

export interface Moment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  images: string[];
  likes: number;
  isLiked?: boolean;
  comments: Comment[];
  time: string;
}
