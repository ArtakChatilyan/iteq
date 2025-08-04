import { useSelector } from "react-redux";
import Chat from "./Chat";

const ChatContainer = () => {
  const isAuth = useSelector((state) => state.userReducer.isAuth);
  const user = useSelector((state) => state.userReducer.user);
  const userRole = useSelector((state) => state.userReducer.userRole);

  return <Chat isAuth={isAuth} user={user} role={userRole} />;
};

export default ChatContainer;
