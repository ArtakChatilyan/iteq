import { useEffect, useState } from "react";
import styles from "./Orders.module.css";
import "animate.css";
import LoadingScreen from "../../loadingScreen/LoadingScreen";
import Paging from "../../paging/Paging";
import { orderAPI } from "../../dalUser/userApi";
import OrderCard from "./ordercard/OrderCard";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

const Orders = ({ userId }) => {
  const { t, i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    LoadOrders(userId, currentPage, perPage);
  }, [currentPage, userId]);

  const LoadOrders = (userId) => {
    orderAPI
      .getUserOrders(currentPage, perPage, userId)
      .then((response) => {
        setOrderList(response.data.orderList);
        setTotal(response.data.total);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false);
      });
  };

  const pagingHandler = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className={styles.block}>
      {loading && <LoadingScreen showGif={true} />}
      {orderList.map((order) => (
        <OrderCard
          order={order}
        />
      ))}
      <Paging
        mode="user"
        totalCount={total}
        currentPage={currentPage}
        pageSize={perPage}
        paging={pagingHandler}
      />
    </div>
  );
};

export default Orders;
