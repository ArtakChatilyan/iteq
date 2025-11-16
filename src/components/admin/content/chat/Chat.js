import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import styles from "./Chat.module.css";
import { chatAPI } from "../../dal/api";

const socket = io("http://localhost:3001"); // change to your backend domain

const AdminChat = () => {
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  // Fetch user list
  useEffect(() => {
    chatAPI
      .getUsers()
      .then((response) => {
        setUsers(response.data.users);
      })
      .catch((error) => console.log(error))
      .finally(() => {});
    // fetch("http://localhost:3001/api/users")
    //   .then((res) => res.json())
    //   .then(setUsers);
  }, []);

  // Handle incoming messages
  useEffect(() => {
    socket.on("newMessage", (data) => {
      if (data.sender === "user") {
        // update user list if new message received
        setUsers((prev) => {
          const existing = prev.find((u) => u.user_id === data.userId);
          if (existing) {
            return prev.map((u) =>
              u.user_id === data.userId
                ? { ...u, last_message: data.message, last_time: new Date() }
                : u
            );
          } else {
            return [
              {
                user_id: data.userId,
                last_message: data.message,
                last_time: new Date(),
              },
              ...prev,
            ];
          }
        });

        // if open chat is same user, append message
        if (activeUser === data.userId) {
          setMessages((prev) => [...prev, data]);
        }
      }
    });

    return () => socket.off("newMessage");
  }, [activeUser]);

  // Load chat history when admin selects a user
  const openChat = async (userId) => {
    setActiveUser(userId);
    chatAPI
      .getUserMessages(userId)
      .then((response) => {
        setMessages(response.data.messages);
      })
      .catch((error) => console.log(error))
      .finally(() => {});
    // const res = await fetch(`http://localhost:3001/api/messages/${userId}`);
    // const data = await res.json();
    //setMessages(data);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !activeUser) return;
    const msg = { userId: activeUser, sender: "admin", message: input };
    socket.emit("sendMessage", msg);
    setMessages((prev) => [...prev, msg]);
    setInput("");
  };

  return (
    <div className={styles.container}>
      {/* SIDEBAR */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>Users</div>

        {users.map((u) => (
          <div
            key={u.user_id}
            onClick={() => openChat(u.user_id)}
            className={`${styles.userItem} ${
              activeUser === u.user_id ? styles.activeUser : ""
            }`}
          >
            <div className={styles.userId}>{u.user_id}</div>
            <div className={styles.lastMessage}>{u.last_message}</div>
          </div>
        ))}
      </div>

      {/* CHAT AREA */}
      <div className={styles.chatContainer}>
        {!activeUser ? (
          <div className={styles.noUser}>Select a user to start chatting</div>
        ) : (
          <>
            <div className={styles.chatHeader}>Chat with {activeUser}</div>

            <div className={styles.messages}>
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`${styles.message} ${
                    m.sender === "admin"
                      ? styles.adminMessage
                      : styles.userMessage
                  }`}
                >
                  {m.message}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className={styles.inputRow}>
              <input
                className={styles.input}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your message..."
              />
              <button className={styles.sendButton} onClick={sendMessage}>
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminChat;
