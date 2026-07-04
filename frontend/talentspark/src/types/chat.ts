export interface ChatRequest {
  session_id: string;
  message: string;
}

export interface ChatResponse {
  response: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}