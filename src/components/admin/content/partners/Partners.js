import styles from "../View.module.css";
import { partnerAPI } from "../../dal/api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Paging from "../../../paging/Paging";
import loadingImg from "../../../../assets/loading.gif";

const Partners = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const [modal, setModal] = useState(false);
  const [deleteId, setDeleteId] = useState(0);

  useEffect(() => {
    getPartners(currentPage, perPage);
  }, []);

  const pagingHandler = (pageNumber) => {
    setLoading(true);
    getPartners(pageNumber, perPage);
  };

  const getPartners = (currentPage, perPage) => {
    partnerAPI
      .getPartners(currentPage, perPage)
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
    partnerAPI.deletePartner(id).then((response) => {
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
            <th>name</th>
            <th>url</th>
            <th>image</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((d) => (
              <tr className={styles.item} key={`tr${d.id}`}>
                <td>{d.name}</td>
                <td>{d.partnerUrl}</td>
                <td>
                  <img src={d.imgUrl} className={styles.img} />
                </td>
                <td>
                  <Link
                    to={`/admin/editPartner/${d.id}`}
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
              <td>no data to preview</td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td>
              <Link
                to={`/admin/addPartner`}
                style={{ textDecoration: "underline", color: "#7dacee" }}
              >
                add
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

export default Partners;
