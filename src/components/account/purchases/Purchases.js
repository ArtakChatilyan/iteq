import { useEffect, useState } from "react";
import styles from "./Purchases.module.css";
import LoadingScreen from "../../loadingScreen/LoadingScreen";
import Paging from "../../paging/Paging";
import { historyAPI } from "../../dalUser/userApi";
import { useTranslation } from "react-i18next";
import OrderCard from "../orders/ordercard/OrderCard";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const Purchases = () => {
  const { userId } = useParams();
  const { t, i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    LoadHistory(userId, currentPage, perPage);
  }, [currentPage, userId]);

  const LoadHistory = (userId) => {
    historyAPI
      .getUserHistory(currentPage, perPage, userId)
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
    <>
      <Helmet>
        <title>{t("purchases") + " | ITEQ Shop"}</title>
      </Helmet>
      <div className={styles.block}>
        {loading && <LoadingScreen showGif={true} />}
        {historyList.map((order) => (
          <OrderCard key={order.id} order={order} cancel={false} />
        ))}
        {historyList.length > 0 && (
          <Paging
            mode="user"
            totalCount={total}
            currentPage={currentPage}
            pageSize={perPage}
            paging={pagingHandler}
          />
        )}
        {historyList.length === 0 && !loading && (
          <div className={styles.info}>{t("purchasesEmpty")}</div>
        )}
      </div>
    </>
  );
};

export default Purchases;
