import styles from "../View.module.css";
import { useEffect, useState } from "react";
import { portfolioAPI } from "../../dal/api";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import loadingImg from "../../../../assets/loading.gif";
import { Formik } from "formik";

const SubCategories = () => {
  const { itemId } = useParams();
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const [data, setData] = useState([]);

  const [modal, setModal] = useState(false);
  const [deleteId, setDeleteId] = useState(0);

  useEffect(() => {
    getPortfolioOptions(itemId);
  }, []);

  const getPortfolioOptions = (parentId) => {
    portfolioAPI.getPortfolioOptions(parentId).then((response) => {
      if (response) {
        setData(response.data.data);
      }
      setLoading(false);
    });
  };

  const deleteItem = (id) => {
    setLoading(true);
    portfolioAPI.deletePortfolioOptions(id).then((response) => {
      window.location.reload(false);
    });
  };

  return (
    <div className={styles.data}>
      {loading && (
        <div className={styles.loadingWrapper}>
          <img src={loadingImg} className={styles.loading} />
        </div>
      )}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>option name(english)</th>
            <th>option name(georgian)</th>
            <th>option name(russian)</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((d) => (
              <tr key={`l${d.id}`} className={styles.item}>
                <td>{d.optionEn}</td>
                <td>{d.optionGe}</td>
                <td>{d.optionRu}</td>

                <td>
                  <Link
                    to={`/admin/editPortfolioOptions/${itemId}/${d.id}`}
                    className={styles.btn}
                  >
                    edit
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
                    delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>no data to preview</td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={5}>
            <Link
                to={`/admin/addPortfolioOption/${itemId}`}
                style={{ textDecoration: "underline", color: "#7dacee" }}
              >
                add
              </Link>
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
              delete
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

export default SubCategories;
