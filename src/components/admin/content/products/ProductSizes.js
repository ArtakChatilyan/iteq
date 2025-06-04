import styles from "../View.module.css";
import { productsAPI } from "../../dal/api";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SplashScreen from "../splashscreen/SplashScreen";

const ProductSizes = () => {
  const { itemId } = useParams();
  
  const [data, setData] = useState([]);
  
  const [modal, setModal] = useState(false);
  const [deleteId, setDeleteId] = useState(0);

  const [loading, setLoading]=useState(true);

  useEffect(() => {
    getSizes(itemId);
  }, []);

  const getSizes = (id) => {
    productsAPI.getSizes(id).then((response) => {
      if (response) {
        setData(response.data.data);
      }
      setLoading(false);
    });
  };

  const deleteItem = (id) => {
    setLoading(true);
    productsAPI.deleteSize(id).then((data) => {
      window.location.reload(false);
    });
  };

  return (
    <div className={styles.data}>
      {loading && <SplashScreen />}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>dimension</th>
            <th>weight</th>
            <th>price</th>
            <th>discount</th>
            <th>new price</th>
            <th>count</th>
            <th>in stock</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data ? (
            data.map((d) => (
              <tr key={`tr${d.id}`} className={styles.item}>
                <td>
                  {d.dimension}
                </td>
                <td>{d.weight}</td>
                <td>{d.price}</td>
                <td>{d.discount}</td>
                <td>
                  {d.newPrice}
                </td>
                <td>
                  {d.count}
                </td>
                <td>
                  {d.inStock}
                </td>
                <td>
                  <Link
                    to={`/admin/editProductSize/${itemId}/${d.id}`}
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
            <td colSpan={9}>
              <Link
                to={`/admin/addProductSize/${itemId}`}
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

export default ProductSizes;
