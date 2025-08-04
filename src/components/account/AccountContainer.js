import Account from "./Account";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { connect, useSelector } from "react-redux";

const AccountContainer = () => {
  const selectedItem=useParams().item;
  const user = useSelector((state) => state.userReducer.user);
  const loading=useSelector((state)=>state.userReducer.loading);

  if (user.userId === 0) return <Navigate to="/login" replace />;
  return <Account user={user} item={selectedItem}/>;
  
};

export default AccountContainer;
