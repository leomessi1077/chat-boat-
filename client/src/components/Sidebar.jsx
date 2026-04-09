import { formatDistanceToNow } from "date-fns";
import { Trash2, MessageSquare } from "lucide-react";
import { useChatStore } from "../store/chatStore";
import { useAuthStore } from "../store/authStore";

export default function Sidebar() {
  const { conversations, activeConversationId, setActiveConversation, deleteConversation, fetchConversations } = useChatStore();
  const { user, logout } = useAuthStore();

  const handleNewChat = () => {
    setActiveConversation(null);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Delete this conversation?")) {
      await deleteConversation(id);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🤖</div>
          <span className="sidebar-logo-text">NexusAI</span>
        </div>
        <button id="new-chat-btn" className="new-chat-btn" onClick={handleNewChat}>
          <span style={{ fontSize: "18px" }}>+</span>
          New conversation
        </button>
      </div>

      <p className="sidebar-section-title">Recent Chats</p>

      <div className="conversations-list">
        {conversations.length === 0 ? (
          <div className="empty-conversations">
            <div className="empty-icon">💬</div>
            <p className="empty-text">No conversations yet.</p>
            <p className="empty-text">Start a new chat!</p>
          </div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv._id}
              id={`conv-${conv._id}`}
              className={`conversation-item ${activeConversationId === conv._id ? "active" : ""}`}
              onClick={() => setActiveConversation(conv._id)}
            >
              <div className="conversation-item-content">
                <p className="conversation-item-title">{conv.title || "New Chat"}</p>
                <p className="conversation-item-time">
                  {formatDistanceToNow(new Date(conv.updatedAt), { addSuffix: true })}
                </p>
              </div>
              <div className="conversation-item-actions">
                <button
                  className="btn-icon danger"
                  onClick={(e) => handleDelete(e, conv._id)}
                  title="Delete conversation"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{user?.avatar || user?.name?.[0]?.toUpperCase()}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="user-name">{user?.name}</p>
            <p className="user-email">{user?.email}</p>
          </div>
        </div>
        <div className="sidebar-footer-actions">
          <button
            id="logout-btn"
            className="btn btn-ghost"
            style={{ fontSize: "12px", padding: "8px 14px" }}
            onClick={handleLogout}
          >
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}
