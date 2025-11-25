import { useEffect, useState, useRef } from "react";
import styles from "./ChatWidget.module.css";
import closeIcon from "../../assets/close-circle.png";
import { useChat } from "../../contexts/UserContext";

export default function ChatWidget({ closeChat }) {
  const { messages, sendMessage, setHasUnread } = useChat();
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    setHasUnread(false);
  }, [setHasUnread]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <span>Customer Support</span>
        <img src={closeIcon} className={styles.closeIcon} onClick={closeChat} />
      </div>

      <div className={styles.messages}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`${styles.message} ${
              msg.sender === "admin" ? styles.admin : styles.user
            }`}
          >
            <div className={styles.msgText}>{msg.message}</div>
            <div className={styles.time}>
              {msg.time && !isNaN(new Date(msg.time))
                ? new Date(msg.time).toLocaleTimeString([], {
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.inputRow}>
        <input
          className={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
        />
        <button className={styles.sendButton} onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}
