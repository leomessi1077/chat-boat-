import { useEffect, useRef } from "react";
import { useChatStore } from "../store/chatStore";
import { useAuthStore } from "../store/authStore";
import { useSocket } from "../hooks/useSocket";
import Sidebar from "../components/Sidebar";
import MessageBubble from "../components/MessageBubble";
import TypingIndicator from "../components/TypingIndicator";
import ChatInput from "../components/ChatInput";

const SUGGESTIONS = [
  { icon: "💡", title: "Explain a concept", text: "Explain quantum computing in simple terms" },
  { icon: "💻", title: "Write code", text: "Write a Python function to sort a list of dictionaries" },
  { icon: "✍️", title: "Creative writing", text: "Write a short sci-fi story about AI and humanity" },
  { icon: "🔍", title: "Analysis", text: "What are the pros and cons of microservices architecture?" },
];

export default function Chat() {
  const { token } = useAuthStore();
  const {
    conversations,
    activeConversationId,
    messages,
    isLoading,
    isStreaming,
    streamingContent,
    fetchConversations,
  } = useChatStore();

  const messagesEndRef = useRef(null);
  const { sendMessage } = useSocket(token);

  useEffect(() => {
    fetchConversations();
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  const handleSend = (content) => {
    sendMessage(activeConversationId, content);
  };

  const handleSuggestion = (text) => {
    sendMessage(null, text);
  };

  const activeConversation = conversations.find((c) => c._id === activeConversationId);

  return (
    <div className="app">
      <Sidebar />

      <main className="chat-area">
        {/* Header */}
        <div className="chat-header">
          <div>
            <p className="chat-header-title">
              {activeConversation?.title || "NexusAI Chat"}
            </p>
            <div className="chat-header-subtitle">
              <span className="status-dot" />
              Powered by Gemini 1.5 Flash
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="messages-area">
          {isLoading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
              <div className="spinner" style={{ width: "28px", height: "28px" }} />
            </div>
          ) : messages.length === 0 && !isStreaming ? (
            <div className="welcome-screen">
              <div className="welcome-icon">🤖</div>
              <h1 className="welcome-title">NexusAI</h1>
              <p className="welcome-subtitle">
                Your intelligent AI assistant powered by Google Gemini. Ask me anything — coding, writing, analysis, and more.
              </p>
              <div className="welcome-suggestions">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    id={`suggestion-${i}`}
                    className="suggestion-card"
                    onClick={() => handleSuggestion(s.text)}
                  >
                    <span className="suggestion-icon">{s.icon}</span>
                    <span className="suggestion-title">{s.title}</span>
                    <span className="suggestion-text">{s.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <MessageBubble key={msg._id} message={msg} />
              ))}

              {isStreaming && (
                <>
                  {streamingContent ? (
                    <MessageBubble
                      message={{ role: "assistant", content: "" }}
                      isStreaming
                      streamingContent={streamingContent}
                    />
                  ) : (
                    <TypingIndicator />
                  )}
                </>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        <ChatInput onSend={handleSend} />
      </main>
    </div>
  );
}
