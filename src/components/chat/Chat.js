import styles from "./Chat.module.css";
import closeIcon from "../../assets/close-circle.png";
import sendIcon from "../../assets/send-26.svg";
import mailIcon from "../../assets/mail-icon.png";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";
const socket = io("http://localhost:3001");

const Chat = ({isAuth, user, role}) => {
  
  const [mode, setMode] = useState(true);
  const [roomId, setRoomId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMesages] = useState([]);

  useEffect(() => {
      socket.on("to_admin", (data) => {
        if (role === "admin")
        console.log(data);
      });
    
  }, [socket, role]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data);
    });
  }, [socket]);

  useEffect(() => {
    if (isAuth) setRoomId(user.id);
    else setRoomId(socket.id);
  }, [isAuth, socket.id, user]);

  const sendMessage = () => {
    console.log(roomId);

    if (message) {
      socket.emit("send_message", {
        roomId: roomId,
        message: message,
        messageType: 0,
        messageTime: new Date().toLocaleString(),
      });
      setMessage("");
    }
  };

  return mode ? (
    <div className={styles.block}>
      <div className={styles.header}>
        <span style={{ marginLeft: "2rem" }}>ITEQ{role && "_Admin"}</span>
        <img
          src={closeIcon}
          className={styles.closeBtn}
          onClick={() => {
            setMode(false);
          }}
        />
      </div>
      <div className={styles.content}>content</div>
      <div className={styles.group}>
        <textarea
          className={styles.input}
          placeholder="message..."
          autoFocus
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <img src={sendIcon} className={styles.btn} onClick={sendMessage} />
      </div>
    </div>
  ) : (
    <div className={styles.blockStart}>
      <img
        src={mailIcon}
        className={styles.mail}
        onClick={() => {
          setMode(true);
        }}
      />
    </div>
  );
};

export default Chat;
