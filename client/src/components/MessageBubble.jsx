import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { format } from "date-fns";
import { Copy, Check } from "lucide-react";
import { useAuthStore } from "../store/authStore";

function CodeBlock({ language, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <span className="code-lang">{language || "code"}</span>
        <button className="code-copy-btn" onClick={handleCopy}>
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <SyntaxHighlighter
        style={oneDark}
        language={language || "text"}
        PreTag="div"
        customStyle={{ margin: 0, borderRadius: 0, fontSize: "13px" }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export default function MessageBubble({ message, isStreaming, streamingContent }) {
  const { user } = useAuthStore();
  const [copied, setCopied] = useState(false);

  const isUser = message.role === "user";
  const content = isStreaming ? streamingContent : message.content;
  const initials = user?.avatar || user?.name?.[0]?.toUpperCase() || "U";

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`message-wrapper ${isUser ? "user" : ""}`}>
      {!isUser && (
        <div className="message-avatar bot">🤖</div>
      )}

      <div className="message-content">
        <div className={`message-bubble ${isUser ? "user" : "bot"}`}>
          {isUser ? (
            <span style={{ whiteSpace: "pre-wrap" }}>{content}</span>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const code = String(children).replace(/\n$/, "");
                  if (!inline && (match || code.includes("\n"))) {
                    return <CodeBlock language={match ? match[1] : ""} code={code} />;
                  }
                  return <code className={className} {...props}>{children}</code>;
                },
              }}
            >
              {content}
            </ReactMarkdown>
          )}
          {isStreaming && (
            <span
              style={{
                display: "inline-block",
                width: "2px",
                height: "16px",
                background: "var(--accent-teal)",
                marginLeft: "2px",
                verticalAlign: "middle",
                animation: "pulse 1s ease infinite",
              }}
            />
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {message.createdAt && (
            <span className="message-time">
              {format(new Date(message.createdAt), "h:mm a")}
            </span>
          )}
          {!isUser && !isStreaming && (
            <div className="message-actions">
              <button className="copy-btn" onClick={handleCopy}>
                {copied ? <Check size={11} /> : <Copy size={11} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          )}
        </div>
      </div>

      {isUser && (
        <div className="message-avatar user-av">{initials}</div>
      )}
    </div>
  );
}
