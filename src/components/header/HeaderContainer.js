import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import { useEffect, useState } from "react";
import { checkAuth, getBasketItemsCount, logout, setLoading } from "../../redux-store/userSlice";
import LoadingScreen from "../loadingScreen/LoadingScreen";
import { basketAPI } from "../dalUser/userApi";

const HeaderContainer = ({ changeLanguage }) => {
  //const isPortrait = window.matchMedia("(orientation: portrait)").matches;
  const loading = useSelector((state) => state.userReducer.loading);
  const isAuth = useSelector((state) => state.userReducer.isAuth);
  const user = useSelector((state) => state.userReducer.user);
  const userRole = useSelector((state) => state.userReducer.userRole);
  const basketItemsCount = useSelector((state)=>state.userReducer.basketItemsCount);
  const dispatch = useDispatch();

  useEffect(() => {
    //console.log(isPortrait);

    if (localStorage.getItem("tokenIteq")) {
      dispatch(checkAuth());
    } else {
      dispatch(setLoading(false));
    }
  }, []);

  useEffect(() => {
    // basketAPI
    //   .getUserTotal(user.userId)
    //   .then((response) => setBasketItemsCount(response.data.total))
    //   .catch((error) => console.log(error))
    //   .finally(() => {});
    dispatch(getBasketItemsCount(user.userId));
  }, [user]);

  const logOutHandle = () => {
    dispatch(logout());
  };
  if (loading) {
    return <LoadingScreen showGif={false} />;
  }
  return (
    <Header
      changeLanguage={changeLanguage}
      isAuth={isAuth}
      userRole={userRole}
      userData={user}
      basketItemsCount={basketItemsCount}
      logout={logOutHandle}
    />
  );
};

export default HeaderContainer;
