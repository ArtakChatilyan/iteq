import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "../View.module.css";
import SplashScreen from "../splashscreen/SplashScreen";
import { orderApi } from "../../dal/api";

const History = () => {
  const { clientId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (clientId) {
      LoadHistoryByClient(currentPage, perPage, clientId);
    } else {
      LoadHistory(currentPage, perPage);
    }
  }, [currentPage, clientId]);

  const LoadHistory = (page, count) => {
    orderApi
      .getHistory(page, count)
      .then((response) => {
        setHistoryList(response.data.historyList);
        setTotal(response.data.total);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false);
      });
  };

  const LoadHistoryByClient = (page, count, clientId) => {
    orderApi
      .getHistoryByClient(page, count, clientId)
      .then((response) => {
        setHistoryList(response.data.historyList);
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
          </tr>
        </thead>
        <tbody>
          {historyList.map((hl) => (
            <tr key={`l${hl.id}`} className={styles.item}>
              <td>{hl.productInfo[0].productNameEn}</td>
              <td>{hl.modelInfo.modelNameEn}</td>
              <td>{hl.modelInfo.dimension && hl.modelInfo.dimension}</td>
              <td>{hl.modelInfo.colorNameRu && hl.modelInfo.colorNameRu}</td>
              <td>{hl.count}</td>
              <td>{hl.price}&#8382;</td>
              <td>{hl.count * hl.price}&#8382;</td>

              <td>{hl.email}</td>
              <td>{hl.orderDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;
