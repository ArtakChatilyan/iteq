import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import styles from "./ChatWidget.module.css"

const socket = io("http://localhost:3001"); // change to your backend URL

export default function ChatWidget() {
  const [userId, setUserId] = useState(localStorage.getItem("chat_user_id"));
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    console.log(userId);
    
    socket.emit("joinChat", userId);

    socket.on("chatHistory", (data) => {
      console.log("data:");
      console.log(data);
      
      
      setUserId(data.userId);
      localStorage.setItem("chat_user_id", data.userId);
      setMessages(data.messages);
    });

    socket.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chatHistory");
      socket.off("newMessage");
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const msg = { userId, sender: "user", message: input };
    socket.emit("sendMessage", msg);
    setMessages((prev) => [...prev, msg]);
    setInput("");
  };

  return (
    <div className={styles.widget}>
      <div className={styles.header}>Live Chat</div>

      <div className={styles.messages}>
        {messages.map((m, i) => (
          <div
            key={i}
            className={`${styles.message} ${
              m.sender === "user" ? styles.user : styles.admin
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
          placeholder="Type a message..."
        />
        <button className={styles.sendButton} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}
