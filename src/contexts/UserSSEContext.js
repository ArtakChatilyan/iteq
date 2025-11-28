import { createContext, useContext, useEffect, useState } from "react";
import { chatAPI } from "../components/dalUser/userApi";
import { convertUTCToLocal } from "../components/tools/convertUTCToLocal";
export const UserChatContext = createContext(null);
export const useUserChat = () => useContext(UserChatContext);

const API_URL = "http://localhost:3001"; // backend

export const UserChatProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [messages, setMessages] = useState([]); // messages for this user only
  const [hasUnread, setHasUnread] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    let id = localStorage.getItem("userId");
    if (!id) {
      id = "usr_" + Math.random().toString(36).slice(2, 10);
      localStorage.setItem("userId", id);
    }
    setUserId(id);
  }, []);

  useEffect(() => {
    if (!userId) return;

    const es = new EventSource(`${API_URL}/events/${userId}`);

    es.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages((prev) => [...prev, {...data, time: convertUTCToLocal(data.time.replace(" ", "T") + "Z")}]);

      if (!chatOpen) {
        setHasUnread(true);
        playSound();
      }
    };

    return () => es.close();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    chatAPI
      .getUserMessages(userId)
      .then((response) => {
        setMessages(response.data.messages);
      })
      .catch((error) => console.log(error))
      .finally(() => {});
  }, [userId]);

  const sendUserMessage = async (text) => {
    const payload = {
      sender: "user",
      userId: userId,
      message: text,
      time: new Date().toISOString().slice(0, 19).replace("T", " "),
      is_seen: 0,
    };

    await fetch(`${API_URL}/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setMessages((prev) => [
      ...prev,
      {
        ...payload,
        time: convertUTCToLocal(payload.time.replace(" ", "T") + "Z"),
      },
    ]);
  };

  const openChat = () => {
    setChatOpen(true);
    setHasUnread(false); 
  };

  const closeChat = () => {
    setChatOpen(false);
  };

  const playSound = () => {
    const audio = new Audio("/notify.mp3");
    audio.play().catch(() => {});
  };

  return (
    <UserChatContext.Provider
      value={{
        userId,
        messages,
        sendUserMessage,
        hasUnread,
        chatOpen,
        openChat,
        closeChat,
      }}
    >
      {children}
    </UserChatContext.Provider>
  );
};
