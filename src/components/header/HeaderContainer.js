import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import { useEffect } from "react";
import { checkAuth, logout, setLoading } from "../../redux-store/userSlice";
import LoadingScreen from "../loadingScreen/LoadingScreen";

const HeaderContainer = ({ changeLanguage }) => {
  const loading=useSelector((state)=>state.userReducer.loading);
  const isAuth = useSelector((state) => state.userReducer.isAuth);
  const user = useSelector((state) => state.userReducer.user);
  const userRole=useSelector((state)=> state.userReducer.userRole);
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("tokenIteq")) {
      
      
      dispatch(checkAuth());
    }else{
      dispatch(setLoading(false));
    }
  }, []);

  const logOutHandle = () => {
    dispatch(logout());
  };
  if(loading){
    return <LoadingScreen showGif={false}/>
  }
  return (
    <Header
      changeLanguage={changeLanguage}
      isAuth={isAuth}
      userRole={userRole}
      userData={user}
      logout={logOutHandle}
    />
  );
};

export default HeaderContainer;
