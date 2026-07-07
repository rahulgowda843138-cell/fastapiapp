import { useState } from "react";
import Chat from "../pages/Chat";
import "./FloatingChat.css";

export default function FloatingChat() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open ? (
        <div className="floating-chat">

          <div className="floating-header">

            <div>
              🤖 AI Assistant
            </div>

            <button
              onClick={() => setOpen(false)}
            >
              ✕
            </button>

          </div>

          <div className="floating-body">
            <Chat />
          </div>

        </div>
      ) : (
        <button
          className="floating-button"
          onClick={() => setOpen(true)}
        >
          💬
        </button>
      )}
    </>
  );
}