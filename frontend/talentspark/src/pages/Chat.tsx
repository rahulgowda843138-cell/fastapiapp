import { useEffect, useRef, useState } from "react";
import ChatService from "../Services/ChatService";
import type { ChatMessage } from "../types/chat";
import "./Chat.css";

const STORAGE_KEY = "career_chat_history";

/**
 * Chat - Dedicated Career Counselor AI Assistant page or panel.
 * Connects to the /chat/ backend router to provide context-aware chat history support.
 */
export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);

  // Initialize a unique Session ID on mount or retrieve from sessionStorage
  useEffect(() => {
    let sid = sessionStorage.getItem("career_chat_session_id");
    if (!sid) {
      sid = "career_session_" + Math.random().toString(36).substring(2, 10);
      sessionStorage.setItem("career_chat_session_id", sid);
    }
    setSessionId(sid);

    // Retrieve local message history for visual persistence
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  // Sync scrollbar and local message logs whenever message thread updates
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // Send message handler using ChatService
  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = message.trim();
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      // Hit backend conversational API
      const replyText = await ChatService.sendMessage(userMessage, sessionId);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: replyText,
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch response:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "I am having trouble connecting to the career advisor network. Please check your connection and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Resets chat log and session context
  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setMessages([]);
    
    // Regenerate unique session ID to start fresh on the backend too
    const newSid = "career_session_" + Math.random().toString(36).substring(2, 10);
    sessionStorage.setItem("career_chat_session_id", newSid);
    setSessionId(newSid);
  };

  return (
    <div className="chat-wrapper">
      
      <div className="chat-top">
        <div className="chat-top-info">
          <h3>Career AI Counselor</h3>
          <span className="session-tag">Session Active</span>
        </div>
        <button className="clear-btn" onClick={clearHistory}>
          🗑️ Clear
        </button>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-welcome">
            <div className="bot-avatar">🤖</div>
            <h4>Welcome to Career Chat!</h4>
            <p>
              I am your AI Career Counselor. Ask me about career paths, resume tips, interview prep, or how to land your dream job!
            </p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-bubble-container ${msg.role === "user" ? "user-container" : "ai-container"}`}
            >
              <div className="avatar-icon">
                {msg.role === "user" ? "👤" : "🤖"}
              </div>
              <div className={`chat-bubble ${msg.role === "user" ? "chat-user" : "chat-ai"}`}>
                {msg.text}
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="chat-bubble-container ai-container">
            <div className="avatar-icon">🤖</div>
            <div className="chat-bubble chat-ai loading-dots">
              <span>.</span><span>.</span><span>.</span>
            </div>
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      <div className="chat-input-area">
        <input
          placeholder="Ask me anything about your career path..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
        />
        <button className="send-btn" onClick={handleSend}>
          ✈️
        </button>
      </div>

    </div>
  );
}