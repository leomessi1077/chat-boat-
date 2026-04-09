import { create } from "zustand";
import api from "../lib/api";

export const useChatStore = create((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messages: [],
  isLoading: false,
  isStreaming: false,
  streamingMessageId: null,
  streamingContent: "",

  fetchConversations: async () => {
    try {
      const res = await api.get("/chat/conversations");
      set({ conversations: res.data });
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
    }
  },

  setActiveConversation: async (id) => {
    set({ activeConversationId: id, messages: [], isLoading: true });
    if (!id) {
      set({ isLoading: false });
      return;
    }
    try {
      const res = await api.get(`/chat/conversations/${id}/messages`);
      set({ messages: res.data, isLoading: false });
    } catch (err) {
      console.error("Failed to fetch messages:", err);
      set({ isLoading: false });
    }
  },

  deleteConversation: async (id) => {
    await api.delete(`/chat/conversations/${id}`);
    const { conversations, activeConversationId } = get();
    const updated = conversations.filter((c) => c._id !== id);
    set({ conversations: updated });
    if (activeConversationId === id) {
      set({ activeConversationId: null, messages: [] });
    }
  },

  // Called from socket events
  addMessage: (message) => {
    set((state) => ({ messages: [...state.messages, message] }));
  },

  setConversationCreated: (conversation) => {
    set((state) => ({
      conversations: [conversation, ...state.conversations],
      activeConversationId: conversation._id,
    }));
  },

  startStreaming: (messageId) => {
    set({ isStreaming: true, streamingMessageId: messageId, streamingContent: "" });
  },

  appendStreamToken: (token) => {
    set((state) => ({ streamingContent: state.streamingContent + token }));
  },

  endStreaming: (finalMessage, conversationId, title) => {
    set((state) => {
      const updatedConversations = state.conversations.map((c) =>
        c._id === conversationId ? { ...c, title, updatedAt: new Date().toISOString() } : c
      );
      // Sort by updatedAt desc
      updatedConversations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

      return {
        isStreaming: false,
        streamingMessageId: null,
        streamingContent: "",
        messages: [...state.messages, finalMessage],
        conversations: updatedConversations,
      };
    });
  },
}));
