import { useDispatch, useSelector } from "react-redux";
import Register from "./Register";
import { register } from "../../redux-store/userSlice";

const RegisterContainer = () => {
  const dispatch = useDispatch();

  const message = useSelector((state) => state.userReducer.message);
  const error = useSelector((state) => state.userReducer.error);

  const registerHandle = (data) => {
    dispatch(register(data));
  };
  return <Register register={registerHandle} message={message} error={error}/>;
};

export default RegisterContainer;
