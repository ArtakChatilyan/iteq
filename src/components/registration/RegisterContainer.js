import { useDispatch, useSelector } from "react-redux";
import Register from "./Register";
import { register, resend } from "../../redux-store/userSlice";

const RegisterContainer = () => {
  const dispatch = useDispatch();

  const message = useSelector((state) => state.userReducer.message);
  const error = useSelector((state) => state.userReducer.error);
  const isSuccess = useSelector((state) => state.userReducer.registerSuccess);

  const registerHandle = (data) => {
    dispatch(register(data));
  };

  const resendHandle = () => {
    dispatch(resend());
  };
  return (
    <Register
      register={registerHandle}
      resendLink={resendHandle}
      message={message}
      error={error}
      isSuccess={isSuccess}
    />
  );
};

export default RegisterContainer;
