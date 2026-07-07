import api from "./api";
import type {
  ChatResponse,
} from "../types/chat";

/**
 * ChatService - Manages conversations with the backend career AI assistant.
 * It routes messages to the /chat/ endpoint which uses LangChain memory for context awareness.
 */
class ChatService {
  /**
   * Sends a user query to the career counselor chatbot.
   * @param message The user's input text
   * @param sessionId Session ID to preserve memory of previous interactions
   */
  async sendMessage(
    message: string,
    sessionId: string = "default_career_session"
  ): Promise<string> {
    try {
      // POST requests are forwarded to the FastAPI chat router at '/chat/'
      const response = await api.post<ChatResponse>(
        "/chat/",
        {
          message,
          session_id: sessionId,
        }
      );

      // Return the string response from the chatbot
      return response.data.response;
    } catch (error) {
      console.error("Chat Service Error:", error);
      throw error;
    }
  }
}

export default new ChatService();