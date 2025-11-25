// AdminAuthWrapper.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth, setLoading } from "../../../redux-store/userSlice";
import { Navigate } from "react-router-dom";
import SplashScreen from "../content/splashscreen/SplashScreen";

const AdminAuthWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.userReducer.loading);
  const userRole = useSelector((state) => state.userReducer.userRole);

  useEffect(() => {
    if (localStorage.getItem("tokenIteq")) {
      dispatch(checkAuth());
    } else {
      dispatch(setLoading(false));
    }
  }, []);

  if (loading) return <SplashScreen />;
  if (userRole !== "admin") return <Navigate to="/login" replace />;

  return children;
};

export default AdminAuthWrapper;
