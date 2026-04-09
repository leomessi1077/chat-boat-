import { useRef, useEffect, useState } from "react";
import { Send, Square } from "lucide-react";
import { useChatStore } from "../store/chatStore";

export default function ChatInput({ onSend }) {
  const { isStreaming } = useChatStore();
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
  }, [value]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isStreaming) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-input-area">
      <div className={`chat-input-container ${isStreaming ? "disabled" : ""}`}>
        <textarea
          id="chat-textarea"
          ref={textareaRef}
          className="chat-textarea"
          placeholder={isStreaming ? "NexusAI is responding…" : "Message NexusAI… (Enter to send, Shift+Enter for newline)"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isStreaming}
          rows={1}
        />
        <button
          id="send-btn"
          className="send-btn"
          onClick={handleSend}
          disabled={!value.trim() || isStreaming}
          title="Send message"
        >
          <Send size={17} />
        </button>
      </div>
      <p className="chat-input-hint">
        NexusAI can make mistakes. Verify important information.
      </p>
    </div>
  );
}
