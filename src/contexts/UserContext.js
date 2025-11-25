// src/contexts/ChatContext.jsx
import { createContext, useContext, useMemo, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { chatAPI } from "../components/dalUser/userApi";

const ChatContext = createContext();
export const useChat = () => useContext(ChatContext);

export function ChatProvider({ children }) {
  const socket = useMemo(
    () =>
      io("http://localhost:3001", {
        transports: ["websocket"],
      }),
    []
  );

//   const socket = useMemo(() =>
//     io("https://iteq.shop", {
//       secure: true,
//       transports: ["websocket"],
//     })
//   );

  const [clientId, setClientId] = useState(() => {
    const saved = localStorage.getItem("chat_user_id");
    if (saved) return saved;

    const id = "guest_" + Math.random().toString(36).substring(2, 10);
    localStorage.setItem("chat_user_id", id);
    return id;
  });

  const [messages, setMessages] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const notificationSound = useMemo(() => {
    const audio = new Audio("/notify.mp3");
    audio.volume = 0.7;
    return audio;
  }, []);

  // --- CONNECT + JOIN ---
  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("joinChat", {
        userId: clientId,
        role: "user",
      });
    });

    return () => socket.off("connect");
  }, [socket, clientId]);

  // --- RECEIVE MESSAGES ---
  useEffect(() => {
    const handler = (msg) => {
      setMessages((prev) => [...prev, msg]);

      if (!chatOpen) {
        setHasUnread(true);
        notificationSound.play().catch(() => {});
      }
    };

    socket.on("newMessage", handler);
    return () => socket.off("newMessage", handler);
  }, [socket, chatOpen, notificationSound]);

  // --- LOAD HISTORY WHEN CHAT OPENS ---
  useEffect(() => {
    if (!chatOpen) return;

    (async () => {
      try {
        const response = await chatAPI.getUserMessages(clientId);

        setMessages(response.data.messages || []);
        setHasUnread(false);
      } catch (err) {
        console.error("Failed to load chat history:", err);
      }
    })();
  }, [chatOpen, clientId]);

  // --- SEND MESSAGE ---
  const sendMessage = (text) => {
    if (!text.trim()) return;

    const time = new Date().toISOString().slice(0, 19).replace("T", " ");

    const msg = {
      userId: clientId,
      sender: "user",
      message: text,
      time,
    };

    socket.emit("sendMessage", msg);
    setMessages((prev) => [...prev, msg]);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        sendMessage,
        chatOpen,
        setChatOpen,
        hasUnread,
        setHasUnread,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
