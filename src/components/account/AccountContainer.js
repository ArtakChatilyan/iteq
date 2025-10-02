import Account from "./Account";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { connect, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import LoginContainer from "../login/LoginContainer";
import { usersAPI } from "../dalUser/userApi";
import LoadingScreen from "../loadingScreen/LoadingScreen";

const AccountContainer = () => {
  const [userId, setUserId] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("tokenIteq")) {
      usersAPI
        .checkAuth()
        .then((response) => {
          setUserId(response.data.user.userId);
        })
        .catch((error) => console.log(error))
        .finally(() => {setLoading(false)});
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <div>
      {loading && <LoadingScreen />}
      {(userId === 0 && !loading) && <LoginContainer />}
      {userId > 0 && <Account userId={userId} />}
    </div>
  );
};

export default AccountContainer;
