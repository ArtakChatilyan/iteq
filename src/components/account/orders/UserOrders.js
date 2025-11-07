import { useEffect, useState } from "react";
import styles from "./Orders.module.css";
import "animate.css";
import LoadingScreen from "../../loadingScreen/LoadingScreen";
import Paging from "../../paging/Paging";
import { orderAPI } from "../../dalUser/userApi";
import OrderCard from "./ordercard/OrderCard";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const UserOrders = () => {
  const { userId } = useParams();

  const { t, i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalPayment, setModalPayment] = useState(false);
  const [modalCancel, setModalCancel] = useState(false);
  const [isAnimatePayment, setIsAnimatePayment] = useState(false);
  const [isAnimateCancel, setIsAnimateCancel] = useState(false);

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

  const updateOrder = (orderId, value) => {
    setLoading(true);
    orderAPI
      .updateOrder(orderId, value)
      .then((response) => {
        LoadOrders(userId, currentPage, perPage);
        if (value === 2) {
          setModalPayment(true);
          setIsAnimatePayment(true);
        } else if (value === 3) {
          setModalCancel(true);
          setIsAnimateCancel(true);
        }
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false);
      });
  };

  const closeModalPayment = () => {
    setIsAnimatePayment(false);
    setTimeout(() => {
      setModalPayment(false);
    }, 600);
  };

  const closeModalCancel = () => {
    setIsAnimateCancel(false);
    setTimeout(() => {
      setModalCancel(false);
    }, 600);
  };

  return (
    <>
      <Helmet>
        <title>{t("orders") + " | ITEQ Shop"}</title>
      </Helmet>
      <div className={styles.block}>
        {loading && <LoadingScreen showGif={true} />}
        {orderList.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            cancelOrder={updateOrder}
            makePayment={updateOrder}
          />
        ))}
        {orderList.length > 0 && (
          <Paging
            mode="user"
            totalCount={total}
            currentPage={currentPage}
            pageSize={perPage}
            paging={pagingHandler}
          />
        )}

        <div className={modalPayment ? styles.modal : styles.hide}>
          <div
            className={
              isAnimatePayment
                ? "animate__animated animate__bounceInDown"
                : "animate__animated animate__bounceOutUp"
            }
          >
            <div className={styles.btnGroup}>
              <div className={styles.info}>
                <p style={{ marginBottom: "1rem" }}>
                  {t("paymentOrderMessage")}
                </p>{" "}
              </div>
              <button className={styles.btn} onClick={closeModalPayment}>
                ok
              </button>
            </div>
          </div>
        </div>
        <div className={modalCancel ? styles.modal : styles.hide}>
          <div
            className={
              isAnimateCancel
                ? "animate__animated animate__bounceInDown"
                : "animate__animated animate__bounceOutUp"
            }
          >
            <div className={styles.btnGroup}>
              <div className={styles.info}>
                <p style={{ marginBottom: "1rem" }}>
                  {t("cancelOrderMessage")}
                </p>{" "}
              </div>
              <button className={styles.btn} onClick={closeModalCancel}>
                ok
              </button>
            </div>
          </div>
        </div>
        {orderList.length === 0 && !loading && (
          <div className={styles.emptyInfo}>{t("ordersEmpty")}</div>
        )}
      </div>
    </>
  );
};

export default UserOrders;
