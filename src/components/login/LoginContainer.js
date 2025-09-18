import Login from "./Login";
import { login, recover } from "../../redux-store/userSlice";
import { useDispatch, useSelector } from "react-redux";

const LoginContainer = ({close}) => {
  const error = useSelector((state) => state.userReducer.error);
  const dispatch = useDispatch();
  const loginHandle = (data) => {
    dispatch(login(data));
  };

  const sendLinkHandler=(data)=>{
    dispatch(recover(data));
  }

  return <Login login={loginHandle} error={error} close={close} sendLink={sendLinkHandler}/>;
};

export default LoginContainer;
