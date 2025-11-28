import React, { createContext, useContext, useEffect, useState } from "react";
import { chatAPI } from "../components/admin/dal/api"; // adjust path if needed
import { useLocation } from "react-router-dom";
import { convertUTCToLocal } from "../components/tools/convertUTCToLocal";
const notificationSound = new Audio("/notify.mp3");
notificationSound.volume = 0.7;

export const AdminChatContext = createContext(null);
export const useAdminChat = () => useContext(AdminChatContext);

const API_URL = "http://localhost:3001"; // твой backend SSE

export const AdminChatProvider = ({ children }) => {
  const location = useLocation();
  const [users, setUsers] = useState([]); // { userId, lastMessage, lastTime }
  const [unreadCounts, setUnreadCounts] = useState({}); // { userId: count }
  const [hasGlobalUnread, setHasGlobalUnread] = useState(false);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState({}); // { userId: [msg1, msg2] }

  useEffect(() => {
    chatAPI.getUsers().then((response) => {
      setUsers(response.data.users);
    });
  }, []);
  
  useEffect(() => {
    const es = new EventSource(`${API_URL}/events/admin`);

    es.onmessage = (e) => {
      const data = JSON.parse(e.data);
      const { userId, message, sender, time, is_seen } = data;

      if (!userId) return;

      
      setMessages((prev) => ({
        ...prev,
        [userId]: [...(prev[userId] || []), {...data, time:convertUTCToLocal(data.time.replace(" ", "T") + "Z")}],
      }));
      const isOnChatPage = location.pathname.startsWith("/admin/chat");
      const isActiveUser = activeUser === userId;
      if (!isOnChatPage || !isActiveUser) {
        notificationSound.play().catch(() => {});
      }

      
      setUsers((prev) => {
        const exists = prev.find((u) => u.userId === userId);
        if (exists) {
          return prev.map((u) =>
            u.userId === userId
              ? { ...u, lastMessage: message, lastTime: time }
              : u
          );
        }
        return [...prev, { userId, lastMessage: message, lastTime: time }];
      });

      
      if (activeUser !== userId) {
        setUnreadCounts((prev) => {
          const newCount = (prev[userId] || 0) + 1;
          const updated = { ...prev, [userId]: newCount };
          setHasGlobalUnread(true);
          return updated;
        });
      }
    };

    return () => es.close();
  }, [activeUser]);

  useEffect(() => {
    async function loadActive() {
      const res = await fetch(`${API_URL}/connected-users`);
      const users = await res.json();

      setUsers(
        users.map((uid) => ({
          userId: uid,
          lastMessage: "",
          lastTime: "",
        }))
      );
    }

    loadActive();
  }, []);

  const sendAdminMessage = async (userId, text) => {
    const payload = {
      sender: "admin",
      userId,
      message: text,
      time: new Date().toISOString().slice(0, 19).replace("T", " "),
      is_seen: 0,
    };

    await fetch(`${API_URL}/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    
    setMessages((prev) => ({
      ...prev,
      [userId]: [
        ...(prev[userId] || []),
        {
          ...payload,
          time: convertUTCToLocal(payload.time.replace(" ", "T") + "Z"),
        },
      ],
    }));

    setUsers((prev) =>
      prev.map((u) =>
        u.userId === userId
          ? { ...u, lastMessage: text, lastTime: payload.time }
          : u
      )
    );
  };

  useEffect(() => {
    if (!activeUser) return;
    setUnreadCounts((prev) => ({ ...prev, [activeUser]: 0 }));
    setHasGlobalUnread(Object.values(unreadCounts).some((c) => c > 0));
    chatAPI
      .getUserMessages(activeUser)
      .then((response) => {
        setMessages((prev) => ({
          ...prev,
          [activeUser]: response.data.messages,
        }));
      })
      .catch((error) => console.log(error))
      .finally(() => {});
  }, [activeUser]);

  useEffect(() => {
    if (!location.pathname.startsWith("/admin/chat")) {
      if (activeUser !== null) {
        setActiveUser(null);
      }
    } else {
      setHasGlobalUnread(false);
    }
  }, [location.pathname]);

  return (
    <AdminChatContext.Provider
      value={{
        users,
        unreadCounts,
        hasGlobalUnread,
        activeUser,
        setActiveUser,
        messages,
        sendAdminMessage,
      }}
    >
      {children}
    </AdminChatContext.Provider>
  );
};
