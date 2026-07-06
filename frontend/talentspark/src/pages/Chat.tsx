import { useEffect, useState } from "react";
import ChatService from "../Services/ChatService";
import type { ChatMessage } from "../types/chat";

const STORAGE_KEY = "career_chat_history";
const SESSION_ID = "rahul123";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  // Load history when the component opens
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  // Save history whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = message;

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
      const response = await ChatService.sendMessage({
        session_id: SESSION_ID,
        message: userMessage,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: response.response,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Unable to connect to AI server.",
        },
      ]);
    }

    setLoading(false);
  };

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setMessages([]);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
          borderBottom: "1px solid #444",
        }}
      >
        <strong>AI Chat</strong>

        <button onClick={clearHistory}>
          Clear
        </button>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 15,
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.role === "user" ? "right" : "left",
              marginBottom: 15,
            }}
          >
            <strong>{msg.role === "user" ? "You" : "AI"}</strong>

            <div>{msg.text}</div>
          </div>
        ))}

        {loading && <p>Thinking...</p>}
      </div>

      <div
        style={{
          display: "flex",
          gap: 10,
          padding: 10,
          borderTop: "1px solid #444",
        }}
      >
        <input
          style={{
            flex: 1,
            padding: 10,
          }}
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />

        <button onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;