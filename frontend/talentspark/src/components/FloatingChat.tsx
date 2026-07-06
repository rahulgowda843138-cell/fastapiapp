import { useState } from "react";
import Chat from "../pages/Chat";
import "./FloatingChat.css";

export default function FloatingChat() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open ? (
        <div className="chat-window">
          <div className="chat-header">
            <span>AI Assistant</span>

            <button
              className="close-btn"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="chat-body">
            <Chat />
          </div>
        </div>
      ) : (
        <button
          className="chat-button"
          onClick={() => setOpen(true)}
        >
          💬
        </button>
      )}
    </>
  );
}