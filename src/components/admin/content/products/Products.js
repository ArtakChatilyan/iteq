import styles from "../View.module.css";
import { productsAPI } from "../../dal/api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Paging from "../../../paging/Paging";
import SplashScreen from "../splashscreen/SplashScreen";

const Products = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const [modal, setModal] = useState(false);
  const [deleteId, setDeleteId] = useState(0);

  const [loading, setLoading]=useState(true);

  useEffect(() => {
    getProducts(currentPage, perPage);
  }, []);

  const pagingHandler = (pageNumber) => {
    setLoading(true);
    getProducts(pageNumber, perPage);
  };

  const getProducts = (currentPage, perPage) => {
    productsAPI.getProducts(currentPage, perPage).then((response) => {
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
    productsAPI.deleteProduct(id).then((data) => {
      window.location.reload(false);
    });
  };

  return (
    <div className={styles.data}>
      {loading && <SplashScreen />}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>name(english)</th>
            <th>name(georgian)</th>
            <th>name(russian)</th>
            <th>model</th>
            <th>image</th>
            <th></th>
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
                  {d.productNameEn}
                </td>
                <td>{d.productNameGe}</td>
                <td>{d.productNameRu}</td>
                <td>{d.productModel}</td>
                <td>
                  <img src={d.imgUrl} className={styles.img} />
                </td>
                <td>
                  <Link
                    to={`/admin/productSizes/${d.id}`}
                    className={styles.btn}
                  >
                    sizes
                  </Link>
                </td>
                <td>
                  <Link
                    to={`/admin/productImages/${d.id}`}
                    className={styles.btn}
                  >
                    images
                  </Link>
                </td>
                <td>
                  <Link
                    to={`/admin/productCategories/${d.id}`}
                    className={styles.btn}
                  >
                    categories
                  </Link>
                </td>
                <td>
                  <Link
                    to={`/admin/editProduct/${d.id}`}
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
              <td colSpan={9}>no data to preview</td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td>
              <Link
                to={`/admin/addProduct`}
                style={{ textDecoration: "underline", color: "#7dacee" }}
              >
                add
              </Link>
            </td>
            <td colSpan={9}>
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

export default Products;
