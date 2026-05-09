export type MessageRole = "user" | "assistant";

// State machine: idle → session_active → chatting → ending → ended
export type ChatState =
  | "idle"
  | "session_active"
  | "chatting"
  | "ending"
  | "ended";

export type AnalyticsEventType =
  | "session_start"
  | "first_message"
  | "session_end"
  | "return_visit"
  | "crisis_detected";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: Date;
}

export interface ChatSession {
  id: string;
  createdAt: Date;
  expiresAt: Date;
  messages: Message[];
}

export interface SendMessageRequest {
  sessionId: string;
  content: string;
}

export interface SendMessageResponse {
  message: Message;
}

export interface CreateSessionResponse {
  sessionId: string;
  expiresAt: Date;
}
