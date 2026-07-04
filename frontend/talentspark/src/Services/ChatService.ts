import api from "./api";
import type { ChatRequest, ChatResponse } from "../types/chat";

class ChatService {
  async sendMessage(data: ChatRequest): Promise<ChatResponse> {
    const response = await api.post<ChatResponse>("/chat/", data);
    return response.data;
  }
}

export default new ChatService();