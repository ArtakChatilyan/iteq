import styles from "../View.module.css";
import { brandsAPI } from "../../dal/api";
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Paging from "../../../paging/Paging";
import SplashScreen from "../splashscreen/SplashScreen";

const Brands = () => {
  const { page } = useParams();
  const location = useLocation();
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(parseInt(page || 1));
  const [perPage, setPerPage] = useState(3);
  const [total, setTotal] = useState(0);

  const [modal, setModal] = useState(false);
  const [deleteId, setDeleteId] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBrands(currentPage, perPage);
  }, [currentPage]);

  const pagingHandler = (pageNumber) => {
    setLoading(true);
    setCurrentPage(pageNumber);
  };

  const getBrands = (currentPage, perPage) => {
    brandsAPI.getBrands(currentPage, perPage).then((response) => {
      if (response) {
        setData(response.data.data);
        setTotal(response.data.total);
        setCurrentPage(currentPage);
      }
      setLoading(false);
    });
  };

  const deleteItem = (id) => {
    setModal(false);
    setLoading(true);
    brandsAPI
      .deleteBrand(id)
      .then((response) => {
        console.log("navigateing...");
        console.log(location);

        if (data.length === 1) {
          if (currentPage > 1) setCurrentPage((currentPage) => currentPage - 1);
        } else {
          getBrands(currentPage, perPage);
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
            <th>brand name</th>
            <th>brand url</th>
            <th>image</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((d) => (
              <tr key={`tr${d.id}`} className={styles.item}>
                <td>{d.brandName}</td>
                <td>
                  <Link to={d.brandUrl}>{d.brandUrl}</Link>
                </td>
                <td>
                  <img src={d.imgUrl} className={styles.img} />
                </td>
                <td>
                  <Link
                    to={`/admin/editBrand/${d.id}/${currentPage}`}
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
              <td colSpan={4}>no data to preview</td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td>
              <Link
                to={`/admin/addBrand/${currentPage}`}
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

export default Brands;
