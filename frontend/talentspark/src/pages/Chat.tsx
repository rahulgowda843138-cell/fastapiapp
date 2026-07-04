import { useState } from "react";
import ChatService from "../Services/ChatService";
import type { ChatMessage } from "../types/chat";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

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
        session_id: "rahul123",
        message: userMessage,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: response.response,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Unable to connect to the AI server.",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 800, margin: "40px auto" }}>
      <h2>AI Chat Assistant</h2>

      <div
        style={{
          border: "1px solid #ccc",
          height: 450,
          overflowY: "auto",
          padding: 15,
          marginBottom: 20,
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
            <b>{msg.role === "user" ? "You" : "AI"}</b>

            <div>{msg.text}</div>
          </div>
        ))}

        {loading && <p>Thinking...</p>}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <input
          style={{
            flex: 1,
            padding: 12,
          }}
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />

        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Chat;