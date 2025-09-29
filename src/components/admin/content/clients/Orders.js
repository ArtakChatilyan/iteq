import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { orderApi } from "../../dal/api";
import styles from "../View.module.css";
import SplashScreen from "../splashscreen/SplashScreen";
import { useTranslation } from "react-i18next";
import Paging from "../../../paging/Paging";

const Orders = () => {
  const { t, i18n } = useTranslation();
  const { clientId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalCanceled, setTotalCanceled]=useState(0);
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalClose, setModalClose] = useState(false);
  const [modalCancel, setModalCancel] = useState(false);
  const [selectedId, setSelectedId] = useState(0);
  const [selectedOrderId, setSelectedOrderId] = useState(0);

  useEffect(() => {
    if (clientId) {
      LoadOrdersByClient(currentPage, perPage, clientId);
    } else {
      LoadOrders(currentPage, perPage);
    }
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
    if (clientId) {
      LoadOrdersByClient(1, perPage, clientId);
    } else {
      LoadOrders(1, perPage);
    }
  }, [clientId, total, totalCanceled]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        orderApi
          .getOrdersCount()
          .then((response) => {
            setTotal(response.data.total);
            setTotalCanceled(response.data.totalCanceled);
          })
          .catch((error) => console.log(error))
          .finally(() => {});
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const intervalId = setInterval(fetchData, 1000*60*3); 

    return () => clearInterval(intervalId);
  }, []);

  const LoadOrders = (page, count) => {
    orderApi
      .getOrders(page, count)
      .then((response) => {
        setOrderList(response.data.orderList);
        setTotal(response.data.total);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false);
      });
  };

  const LoadOrdersByClient = (page, count, clientId) => {
    orderApi
      .getOrdersByClient(page, count, clientId)
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

  const approveOrder = (orderId) => {
    setLoading(true);
    orderApi
      .approveOrder(orderId)
      .then((response) => {
        LoadOrders(currentPage, perPage);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false);
      });
  };

  const CloseOrder = () => {
    setLoading(true);
    setModalClose(false);
    orderApi
      .closeOrder(selectedId, selectedOrderId)
      .then((response) => {
        if (orderList.length === 1 && currentPage > 1) {
          setCurrentPage((currentPage) => currentPage - 1);
        } else {
          if (clientId) {
            LoadOrdersByClient(currentPage, perPage, clientId);
          } else {
            LoadOrders(currentPage, perPage);
          }
        }
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false);
      });
  };

  const CancelOrder = () => {
    setLoading(true);
    setModalCancel(false);
    orderApi
      .cancelOrder(selectedId, selectedOrderId)
      .then((response) => {
        if (orderList.length === 1 && currentPage > 1) {
          setCurrentPage((currentPage) => currentPage - 1);
        } else {
          if (clientId) {
            LoadOrdersByClient(currentPage, perPage, clientId);
          } else {
            LoadOrders(currentPage, perPage);
          }
        }
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className={styles.data}>
      {loading && <SplashScreen />}
      <table className={styles.table}>
        <thead>
          <tr>
            <th></th>
            <th>{t("admin_product")}</th>
            <th>{t("admin_model")}</th>
            <th>{t("admin_size")}</th>
            <th>{t("admin_color")}</th>
            <th>{t("admin_count")}</th>
            <th>{t("admin_price")}</th>
            <th>{t("admin_total")}</th>
            <th>{t("admin_client")}</th>
            <th>{t("admin_orderDate")}</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orderList.map((ol) => (
            <tr key={`l${ol.id}`} className={styles.item}>
              <td>
                {ol.state === 1 && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "2rem",
                      border: "1px solid red",
                      borderRadius: "50%",
                      display: "inline-flex",
                      width: "3rem",
                      height: "3rem",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    !
                  </div>
                )}
              </td>
              <td>{ol.productInfo[0].productNameEn}</td>
              <td>{ol.modelInfo.modelNameEn}</td>
              <td>{ol.modelInfo.dimension && ol.modelInfo.dimension}</td>
              <td>{ol.modelInfo.colorNameRu && ol.modelInfo.colorNameRu}</td>
              <td>{ol.count}</td>
              <td>{ol.price}&#8382;</td>
              <td>{ol.count * ol.price}&#8382;</td>

              <td>{ol.email}</td>
              <td>{ol.orderDate}</td>
              {/* {ol.state === 0 && (
                <td>
                  <button
                    className={styles.btn}
                    onClick={() => {
                      approveOrder(ol.id);
                    }}
                  >
                    {t("admin_approveOrder")}
                  </button>
                </td>
              )} */}
              {/* {(ol.state === 0) && ( */}
              <td>
                <button
                  className={styles.btn}
                  onClick={() => {
                    setSelectedId(ol.id);
                    setSelectedOrderId(ol.orderId);
                    setModalClose(true);
                  }}
                >
                  {t("admin_closeOrder")}
                </button>
              </td>
              {/* )} */}
              {/* {ol.state === 2 && ( */}
              <td>
                <button
                  className={styles.btn}
                  onClick={() => {
                    setSelectedId(ol.id);
                    setSelectedOrderId(ol.orderId);
                    setModalCancel(true);
                  }}
                >
                  {t("admin_cancelOrder")}
                </button>
              </td>
              {/* )} */}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={12}>
              <div style={{ textAlign: "right" }}>
                <Paging
                  totalCount={total}
                  currentPage={currentPage}
                  pageSize={perPage}
                  paging={pagingHandler}
                />
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
      {modalClose && (
        <div className={styles.modal}>
          <div className={styles.btnGroup}>
            <button className={styles.delBtn} onClick={CloseOrder}>
              {t("admin_closeOrder")}
            </button>
            <button
              className={styles.delBtn}
              onClick={() => setModalClose(false)}
            >
              {t("admin_cancel")}
            </button>
          </div>
        </div>
      )}
      {modalCancel && (
        <div className={styles.modal}>
          <div className={styles.btnGroup}>
            <button className={styles.delBtn} onClick={CancelOrder}>
              {t("admin_cancelOrder")}
            </button>
            <button
              className={styles.delBtn}
              onClick={() => setModalCancel(false)}
            >
              {t("admin_close")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
