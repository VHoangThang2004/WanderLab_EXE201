export type ConversationType = 'direct' | 'group';

export interface Conversation {
  id: string;
  name: string | null;
  type: ConversationType;
  last_message: Message | null;
  members: ConversationMember[];
  unread_count: number;
  last_message_at: string;
  created_at: string;
}

export interface ConversationMember {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  is_online: boolean;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar: string | null;
  content: string;
  image_url: string | null;
  is_read: boolean;
  created_at: string;
}

export interface SendMessagePayload {
  content: string;
  image_url?: string;
}

// AI Chatbot types
export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
  itinerary?: Record<string, unknown>;
  timestamp: string;
}

export interface AIChatRequest {
  message: string;
  history?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

export interface AIChatResponse {
  reply: string;
  suggestions: string[];
  itinerary?: Record<string, unknown>;
}
