import { useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { useChatStore } from "../store/chatStore";

export const useSocket = (token) => {
  const socketRef = useRef(null);
  const {
    addMessage,
    setConversationCreated,
    startStreaming,
    appendStreamToken,
    endStreaming,
  } = useChatStore();

  useEffect(() => {
    if (!token) return;

    const socket = io("http://localhost:5000", {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => console.log("⚡ Socket connected"));
    socket.on("disconnect", () => console.log("⚡ Socket disconnected"));
    socket.on("connect_error", (err) => console.error("Socket connect error:", err.message));

    socket.on("messageCreated", (message) => addMessage(message));
    socket.on("conversationCreated", (conv) => setConversationCreated(conv));
    socket.on("streamStart", ({ messageId }) => startStreaming(messageId));
    socket.on("streamToken", ({ token: tok }) => appendStreamToken(tok));
    socket.on("streamEnd", ({ message, conversationId, title }) =>
      endStreaming(message, conversationId, title)
    );
    socket.on("streamError", ({ error }) => {
      console.error("Stream error:", error);
      endStreaming(
        {
          _id: `err-${Date.now()}`,
          role: "assistant",
          content: "⚠️ Sorry, I ran into an error. Please try again.",
          createdAt: new Date().toISOString(),
        },
        null,
        null
      );
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  const sendMessage = useCallback(
    (conversationId, content) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit("sendMessage", { conversationId, content });
      }
    },
    []
  );

  return { sendMessage };
};
