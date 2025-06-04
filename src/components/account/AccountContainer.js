import Account from "./Account";
import { Navigate, useNavigate } from "react-router-dom";
import { connect, useSelector } from "react-redux";

const AccountContainer = () => {
  const user = useSelector((state) => state.userReducer.user);
  const loading=useSelector((state)=>state.userReducer.loading);

  if(loading) return<div>loading...</div>
  console.log(user);
  
  if (user.id === 0) return <Navigate to="/login" replace />;
  return <Account user={user} />;
  
};

export default AccountContainer;
