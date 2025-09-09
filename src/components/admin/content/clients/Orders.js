import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { orderApi } from "../../dal/api";
import styles from "../View.module.css";
import SplashScreen from "../splashscreen/SplashScreen";

const Orders = () => {
  const { clientId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [closeId, setCloseId] = useState(0);
  const [selectedOrderId, setSelectedOrderId] = useState(0);

  useEffect(() => {
    if (clientId) {
      LoadOrdersByClient(currentPage, perPage, clientId);
    } else {
      LoadOrders(currentPage, perPage);
    }
  }, [currentPage, clientId]);

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
        console.log(response.data);
        
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

  const CloseOrder = () => {
    setLoading(true);
    setModal(false);
    orderApi
      .closeOrder(closeId, selectedOrderId)
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
            <th>product</th>
            <th>model</th>
            <th>size</th>
            <th>color</th>
            <th>count</th>
            <th>price</th>
            <th>total</th>
            <th>client</th>
            <th>order date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orderList.map((ol) => (
            <tr key={`l${ol.id}`} className={styles.item}>
              <td>{ol.productInfo[0].productNameEn}</td>
              <td>{ol.modelInfo.modelNameEn}</td>
              <td>{ol.modelInfo.dimension && ol.modelInfo.dimension}</td>
              <td>{ol.modelInfo.colorNameRu && ol.modelInfo.colorNameRu}</td>
              <td>{ol.count}</td>
              <td>{ol.price}&#8382;</td>
              <td>{ol.count * ol.price}&#8382;</td>

              <td>{ol.email}</td>
              <td>{ol.orderDate}</td>
              <td>
                <button
                  className={styles.btn}
                  onClick={() => {
                    setCloseId(ol.id);
                    setSelectedOrderId(ol.orderId);
                    setModal(true);
                  }}
                >
                  close order
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {modal && (
        <div className={styles.modal}>
          <div className={styles.btnGroup}>
            <button className={styles.delBtn} onClick={CloseOrder}>
              close
            </button>
            <button className={styles.delBtn} onClick={() => setModal(false)}>
              cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
