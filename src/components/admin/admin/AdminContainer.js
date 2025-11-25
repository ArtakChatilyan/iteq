import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";
import { checkAuth, logout, setLoading } from "../../../redux-store/userSlice";
import SplashScreen from "../content/splashscreen/SplashScreen";
import { orderApi } from "../dal/api";
import { AdminContext } from "../../../contexts/AdminContext";

const AdminContainer = () => {
  const { hasGlobalUnread } = useContext(AdminContext);
  const [orderCount, setOrderCount] = useState(0);
  const [canceledOrderCount, setCanceledOrderCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        orderApi
          .getOrdersCount()
          .then((response) => {
            setOrderCount(response.data.total);
            setCanceledOrderCount(response.data.totalCanceled);
          })
          .catch((error) => console.log(error))
          .finally(() => {});
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const intervalId = setInterval(fetchData, 1000 * 60 * 3);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Admin
      logout={logOutHandle}
      orderCount={orderCount}
      canceledOrderCount={canceledOrderCount}
      hasGlobalUnread={hasGlobalUnread}
    />
  );
};

export default AdminContainer;
