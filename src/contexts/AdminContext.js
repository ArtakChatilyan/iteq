// src/contexts/AdminContext.js
import { createContext, useState, useContext, useEffect, useMemo } from "react";
import { io } from "socket.io-client";
import { chatAPI } from "../components/admin/dal/api"; // adjust path if needed
const notificationSound = new Audio("/notify.mp3");
notificationSound.volume = 0.7;

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [users, setUsers] = useState([]); // { userId, lastMessage, lastTime }
  const [unreadCounts, setUnreadCounts] = useState({}); // { userId: count }
  const [hasGlobalUnread, setHasGlobalUnread] = useState(false);
  const [activeUser, setActiveUser] = useState(null);

  // Create single socket instance once
  //const socket = useMemo(() => io("http://localhost:3001"), []);
  const socket = useMemo(() =>
    io("https://iteq.shop", {
      secure: true,
      transports: ["websocket"],
    })
  );

  // Initial unread counts load
  useEffect(() => {
    let mounted = true;
    chatAPI
      .getUnreadList()
      .then((res) => {
        if (!mounted) return;
        const formatted = {};
        res.data.forEach((r) => (formatted[r.user_id] = r.unread));
        setUnreadCounts(formatted);
      })
      .catch(() => {});
    return () => (mounted = false);
  }, []);

  // Socket listeners: activeUsers & newMessage
  useEffect(() => {
    // join as admin so backend will send activeUsers
    socket.emit("joinChat", { userId: "admin", role: "admin" });

    const onActiveUsers = (userList) => {
      // backend sends array of { userId, lastMessage, lastTime }
      // sort by lastTime desc
      const sorted = (userList || []).slice().sort((a, b) => {
        const tA = a.lastTime ? new Date(a.lastTime).getTime() : 0;
        const tB = b.lastTime ? new Date(b.lastTime).getTime() : 0;
        return tB - tA;
      });
      setUsers(sorted);
    };

    const onNewMessage = (msg) => {
      // msg: { userId, sender, message, time, isSeen? }
      // 1) Refresh unread counts from DB (source of truth)
      chatAPI
        .getUnreadList()
        .then((res) => {
          const formatted = {};
          res.data.forEach((r) => (formatted[r.user_id] = r.unread));
          setUnreadCounts(formatted);
        })
        .catch(() => {});

      // 2) Update global unread marker when admin not on chat page
      const isActive = activeUser === msg.userId;
      if (window.location.pathname !== "/admin/chat") {
        setHasGlobalUnread(true);
        notificationSound.play().catch(() => {});
      }

      // 3) Update users list (lastMessage/lastTime) — keep existing entries up to date
      setUsers((prev) => {
        const exists = prev.find((u) => u.userId === msg.userId);
        const updated = {
          userId: msg.userId,
          lastMessage: msg.message,
          lastTime: msg.time,
        };
        if (exists) {
          return prev
            .map((u) => (u.userId === msg.userId ? { ...u, ...updated } : u))
            .sort((a, b) => {
              const tA = a.lastTime ? new Date(a.lastTime).getTime() : 0;
              const tB = b.lastTime ? new Date(b.lastTime).getTime() : 0;
              return tB - tA;
            });
        } else {
          return [updated, ...prev].sort((a, b) => {
            const tA = a.lastTime ? new Date(a.lastTime).getTime() : 0;
            const tB = b.lastTime ? new Date(b.lastTime).getTime() : 0;
            return tB - tA;
          });
        }
      });
    };

    socket.on("activeUsers", onActiveUsers);
    socket.on("newMessage", onNewMessage);

    return () => {
      socket.off("activeUsers", onActiveUsers);
      socket.off("newMessage", onNewMessage);
    };
  }, [socket, activeUser]);

  // helper to refresh unreadCounts (used by Chat when marking seen)
  const refreshUnreadCounts = async () => {
    try {
      const res = await chatAPI.getUnreadList();
      const formatted = {};
      res.data.forEach((r) => (formatted[r.user_id] = r.unread));
      setUnreadCounts(formatted);
    } catch (e) {
      // ignore
    }
  };

  return (
    <AdminContext.Provider
      value={{
        socket,
        users,
        unreadCounts,
        hasGlobalUnread,
        setHasGlobalUnread,
        activeUser,
        setActiveUser,
        refreshUnreadCounts,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
