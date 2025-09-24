import styles from "../View.module.css";
import { newsAPI } from "../../dal/api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Paging from "../../../paging/Paging";
import SplashScreen from "../splashscreen/SplashScreen";
import { useTranslation } from "react-i18next";

const News = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const [modal, setModal] = useState(false);
  const [deleteId, setDeleteId] = useState(0);

  useEffect(() => {
    getNews(currentPage, perPage);
  }, []);

  const pagingHandler = (pageNumber) => {
    setLoading(true);
    getNews(pageNumber, perPage);
  };

  const getNews = (currentPage, perPage) => {
    newsAPI
      .getNews(currentPage, perPage)
      .then((response) => {
        setData(response.data.data);
        setTotal(response.data.total);
        setCurrentPage(currentPage);
      })
      .catch((error) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  const deleteItem = (id) => {
    setLoading(true);
    newsAPI.deleteNews(id).then((response) => {
      window.location.reload(false);
    });
  };

  return (
    <div className={styles.data}>
      {loading && <SplashScreen />}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>{t("admin_titleEn")}:</th>
            <th>{t("admin_titleGe")}:</th>
            <th>{t("admin_titleRu")}:</th>
            <th>{t("admin_image")}:</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((d) => (
              <tr className={styles.item} key={`tr${d.id}`}>
                <td>{d.titleEn}</td>
                <td>{d.titleGe}</td>
                <td>{d.titleRu}</td>
                <td>
                  <img src={d.imgUrl} className={styles.img} />
                </td>
                <td>
                  <Link
                    to={`/admin/editNews/${d.id}`}
                    className={styles.btn}
                  >
                    {t("admin_edit")}
                  </Link>
                </td>
                <td>
                  <button
                    className={styles.btn}
                    onClick={() => {
                      setDeleteId(d.id);
                      setModal(true);
                    }}
                  >
                    {t("admin_delete")}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>no data to preview</td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td>
              <Link
                to={`/admin/addNews`}
                style={{ textDecoration: "underline", color: "#7dacee" }}
              >
                {t("admin_add")}
              </Link>
            </td>
            <td colSpan={6}>
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
      {modal && (
        <div className={styles.modal}>
          <div className={styles.btnGroup}>
            <button
              className={styles.delBtn}
              onClick={() => {
                deleteItem(deleteId);
              }}
            >
              {t("admin_delete")}
            </button>
            <button className={styles.delBtn} onClick={() => setModal(false)}>
              {t("admin_cancel")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;
