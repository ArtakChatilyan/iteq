import styles from "../View.module.css";
import { portfolioAPI, productsAPI } from "../../dal/api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Paging from "../../../paging/Paging";
import loadingImg from "../../../../assets/loading.gif"

const Portfolio = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const [modal, setModal] = useState(false);
  const [deleteId, setDeleteId] = useState(0);

  const [loading, setLoading]=useState(true);

  useEffect(() => {
    getPortfolioAll(currentPage, perPage);
  }, []);

  const pagingHandler = (pageNumber) => {
    setLoading(true);
    getPortfolioAll(pageNumber, perPage);
  };

  const getPortfolioAll = (currentPage, perPage) => {
    portfolioAPI.getPortfolioAll(currentPage, perPage).then((response) => {
      if (response) {
        setData(response.data.data);
        setTotal(response.data.total);
        setCurrentPage(currentPage);
      }
      setLoading(false);
    });
  };

  const deleteItem = (id) => {
    setLoading(true);
    portfolioAPI.deletePortfolio(id).then((data) => {
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
            <th>title(english)</th>
            <th>title(georgian)</th>
            <th>title(russian)</th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((d) => (
              <tr key={`tr${d.id}`} className={styles.item}>
                <td>
                  {d.titleEn}
                </td>
                <td>{d.titleGe}</td>
                <td>{d.titleRu}</td>
                <td>
                  <Link
                    to={`/admin/portfolioImages/${d.id}`}
                    className={styles.btn}
                  >
                    images
                  </Link>
                </td>
                {/* <td>
                  <Link
                    to={`/admin/portfolioOptions/${d.id}`}
                    className={styles.btn}
                  >
                    options
                  </Link>
                </td> */}
                <td>
                  <Link
                    to={`/admin/editPortfolio/${d.id}`}
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
              <td colSpan={7}>no data to preview</td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td>
              <Link
                to={`/admin/addPortfolio`}
                style={{ textDecoration: "underline", color: "#7dacee" }}
              >
                add
              </Link>
            </td>
            <td colSpan={8}>
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

export default Portfolio;
