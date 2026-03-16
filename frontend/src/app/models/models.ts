export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  role: 'user' | 'ai';
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  unread?: boolean;
}

export interface ChatResponse {
  message: Message;
  conversationId: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}
