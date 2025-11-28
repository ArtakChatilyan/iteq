import { useState } from "react";
import { useAdminChat } from "../../../../contexts/AdminSSEContext";
import styles from "./Chat.module.css";
import { convertUTCToLocal } from "../../../tools/convertUTCToLocal";

export default function AdminChat() {
  const {
    users,
    activeUser,
    setActiveUser,
    messages,
    sendAdminMessage,
    unreadCounts,
  } = useAdminChat();


  const [text, setText] = useState("");

  const chatMessages = activeUser ? messages[activeUser] || [] : [];

  const handleSend = async () => {
    if (!text.trim() || !activeUser) return;
    await sendAdminMessage(activeUser, text);
    setText("");
  };

  return (
    <div className={styles.container}>
      {/* LEFT PANEL: users */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>Users</div>

        {users.map((u) => (
          <div
            key={u.userId}
            onClick={() => setActiveUser(u.userId)}
            className={`${styles.userItem} ${
              activeUser === u.userId ? styles.activeUser : ""
            }`}
          >
            <div className={styles.userId}>
              Guest {u.userId.slice(0, 6)}
              {unreadCounts[u.userId] > 0 && (
                <span className={styles.unreadDot}></span>
              )}
            </div>

            <div className={styles.lastMessage}>
              {u.lastMessage || "No messages yet"}
            </div>

            <div className={styles.lastTime}>
              {u.lastTime
                ? new Date(u.lastTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT PANEL: chat window */}
      <div className={styles.chatContainer}>
        {/* HEADER */}
        <div className={styles.chatHeader}>
          {activeUser ? `Chat with ${activeUser}` : "Select a user"}
        </div>
        {/* MESSAGES */}
        <div className={styles.messages}>
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              className={`${styles.message} ${
                msg.sender === "admin"
                  ? styles.adminMessage
                  : styles.userMessage
              }`}
            >
              <div className={styles.msgText}>{msg.message}</div>
              <div className={styles.msgTime}>
                {msg.time && convertUTCToLocal(msg.time)}
                {/* {msg.time &&
                       new Date(msg.time).toLocaleTimeString([], {
                         month: "2-digit",
                         day: "2-digit",
                         hour: "2-digit",
                         minute: "2-digit",
                       })} */}
              </div>
            </div>
          ))}
        </div>

        {/* INPUT */}
        {activeUser && (
          <div className={styles.inputRow}>
            <input
              className={styles.input}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
            />
            <button className={styles.sendButton} onClick={handleSend}>
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// // src/components/admin/.../AdminChat.js
// import { useEffect, useState, useRef } from "react";
// import styles from "./Chat.module.css";
// import { chatAPI } from "../../dal/api"; // adjust path if needed
// import { convertUTCToLocal } from "../../../tools/convertUTCToLocal";

// const notificationSound = new Audio("/notify.mp3");
// notificationSound.volume = 0.7;

// const AdminChat = () => {
//   const {
//     socket,
//     users,
//     unreadCounts,
//     activeUser,
//     setActiveUser,
//     setHasGlobalUnread,
//     refreshUnreadCounts,
//   } = useAdmin();

//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const chatEndRef = useRef(null);

//   // Clear global unread indicator when admin opens chat page
//   useEffect(() => {
//     setHasGlobalUnread(false);
//   }, [setHasGlobalUnread]);

//   // Load messages & mark as seen when activeUser changes
//   useEffect(() => {
//     if (!activeUser) {
//       setMessages([]);
//       return;
//     }

//     let cancelled = false;
//     (async () => {
//       try {
//         // Load history from backend
//         const response = await chatAPI.getUserMessages(activeUser);
//         if (cancelled) return;
//         //console.log(response.data.messages);

//         setMessages(response.data.messages || []);

//         // Mark as seen in DB and refresh unreadCounts in provider
//         await chatAPI.markAsSeen(activeUser);
//         await refreshUnreadCounts();
//       } catch (e) {
//         // ignore
//       }
//     })();

//     return () => {
//       cancelled = true;
//     };
//   }, [activeUser, refreshUnreadCounts]);

//   // Append incoming messages to active chat, and play sound for other users
//   useEffect(() => {
//     const handler = (msg) => {
//       if (msg.userId === activeUser) {
//         setMessages((prev) => [...prev, msg]);
//       } else {
//         // play notification for other users
//         notificationSound.play().catch(() => {});
//       }
//     };

//     socket.on("newMessage", handler);
//     return () => socket.off("newMessage", handler);
//   }, [socket, activeUser]);

//   // Click user in sidebar: set active user (provider holds users list)
//   const openChat = (userId) => {
//     setActiveUser(userId);
//     // clear global unread marker for entire chat page (optional)
//     setHasGlobalUnread(false);
//   };

//   const sendMessage = () => {
//     if (!input.trim() || !activeUser) return;

//     const localDate = new Date().toISOString().slice(0, 19).replace("T", " ");

//     const msg = {
//       userId: activeUser,
//       sender: "admin",
//       message: input,
//       time: localDate,
//     };

//     socket.emit("sendMessage", msg);

//     // append locally for immediate feedback (DB + other admins will also receive)
//     setMessages((prev) => [...prev, msg]);
//     setInput("");
//   };

//   return (
//     <div className={styles.container}>
//       {/* SIDEBAR */}
//       <div className={styles.sidebar}>
//         <div className={styles.sidebarHeader}>Users</div>
//         {users.map((u) => (
//           <div
//             key={u.userId}
//             onClick={() => openChat(u.userId)}
//             className={`${styles.userItem} ${
//               activeUser === u.userId ? styles.activeUser : ""
//             }`}
//           >
//             <div className={styles.userId}>
//               Guest {u.userId.slice(0, 6)}
//               {unreadCounts[u.userId] > 0 && (
//                 <span className={styles.unreadDot}></span>
//               )}
//             </div>

//             <div className={styles.lastMessage}>
//               {u.lastMessage || "No messages yet"}
//             </div>

//             <div className={styles.lastTime}>
//               {u.lastTime
//                 ? new Date(u.lastTime).toLocaleTimeString([], {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   })
//                 : ""}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* CHAT AREA */}
//       <div className={styles.chatContainer}>
//         {!activeUser ? (
//           <div className={styles.noUser}>Select a user to start chatting</div>
//         ) : (
//           <>
//             <div className={styles.chatHeader}>Chat with {activeUser}</div>

//             <div className={styles.messages}>
//               {messages.map((msg, i) => (
//                 <div
//                   key={i}
//                   className={`${styles.message} ${
//                     msg.sender === "admin"
//                       ? styles.adminMessage
//                       : styles.userMessage
//                   }`}
//                 >
//                   <div className={styles.msgText}>{msg.message}</div>
//                   <div className={styles.msgTime}>
//                     {msg.time && convertUTCToLocal(msg.time)}
//                     {/* {msg.time &&
//                       new Date(msg.time).toLocaleTimeString([], {
//                         month: "2-digit",
//                         day: "2-digit",
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })} */}
//                   </div>
//                 </div>
//               ))}
//               <div ref={chatEndRef} />
//             </div>

//             <div className={styles.inputRow}>
//               <input
//                 className={styles.input}
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//                 placeholder="Type your message..."
//               />
//               <button className={styles.sendButton} onClick={sendMessage}>
//                 Send
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminChat;
