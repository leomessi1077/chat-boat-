export default function TypingIndicator() {
  return (
    <div className="message-wrapper" style={{ alignItems: "flex-start" }}>
      <div className="message-avatar bot">🤖</div>
      <div className="typing-indicator">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  );
}
