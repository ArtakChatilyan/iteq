import styles from "../View.module.css";
import { questionsApi } from "../../dal/api";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Paging from "../../../paging/Paging";
import SplashScreen from "../splashscreen/SplashScreen";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../../../../contexts/LanguageContext";

const Questions = () => {
  const { page } = useParams();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(parseInt(page || 1));
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const [modal, setModal] = useState(false);
  const [deleteId, setDeleteId] = useState(0);
  const lang = useContext(LanguageContext);

  useEffect(() => {
    getQuestions(currentPage, perPage);
  }, []);

  const pagingHandler = (pageNumber) => {
    setLoading(true);
    getQuestions(pageNumber, perPage);
  };

  const getQuestions = (currentPage, perPage) => {
    questionsApi
      .getQuestions(currentPage, perPage)
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
    setModal(false);
    questionsApi
      .deleteQuestion(id)
      .then((response) => {
        if (data.length === 1) {
          if (currentPage > 1) setCurrentPage((currentPage) => currentPage - 1);
        } else {
          getQuestions(currentPage, perPage);
        }
      })
      .catch((error) => {
        console.log(error);
      })
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
            <th style={{ width: "70%" }}></th>
            <th style={{ maxWidth: "250px" }}></th>
            <th style={{ maxWidth: "250px" }}></th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((d) => (
              <tr className={styles.item} key={`tr${d.id}`}>
                <td>
                  <div style={{ margin: "1rem" }}>
                    {lang === "en" && d.questionEn}
                    {lang === "ge" && d.questionGe}
                    {lang === "ru" && d.questionRu}
                  </div>
                </td>
                <td>
                  <Link
                    to={`/admin/editQuestion/${d.id}/${currentPage}`}
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
                to={`/admin/addQuestion/${currentPage}`}
                style={{ textDecoration: "underline", color: "#7dacee" }}
              >
                {t("admin_add")}
              </Link>
            </td>
            <td colSpan={2}>
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

export default Questions;
