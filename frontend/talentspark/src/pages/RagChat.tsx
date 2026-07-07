import { useState } from "react";
import { askRag } from "../Services/ragService";
import "./RagChat.css";

interface Message {
  sender: "user" | "ai";
  text: string;
}

export function RagChat() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "Hello 👋 I'm your AI Assistant. Ask me anything about jobs, resumes or your documents."
    }
  ]);

  const sendMessage = async () => {
    if (!question.trim()) return;

    const userMessage = {
      sender: "user" as const,
      text: question
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentQuestion = question;
    setQuestion("");
    setLoading(true);

    try {
      const response = await askRag(currentQuestion);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text:
            response.answer ??
            response.response ??
            response.message ??
            JSON.stringify(response)
        }
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Sorry! Unable to answer your question."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-page">

      <div className="chat-container">

        <div className="chat-header">
          🤖 AI RAG Assistant
        </div>

        <div className="chat-body">

          {messages.map((msg, index) => (

            <div
              key={index}
              className={
                msg.sender === "user"
                  ? "user-message"
                  : "ai-message"
              }
            >
              {msg.text}
            </div>

          ))}

          {loading && (
            <div className="ai-message thinking">
              Thinking...
            </div>
          )}

        </div>

        <div className="chat-footer">

          <input
            value={question}
            placeholder="Ask a question..."
            onChange={(e) =>
              setQuestion(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />

          <button onClick={sendMessage}>
            Send
          </button>

        </div>

      </div>

    </div>
  );
}

export default RagChat;