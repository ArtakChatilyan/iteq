import styles from "../View.module.css";
import { productsAPI } from "../../dal/api";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Modal from "react-modal";
import SplashScreen from "../splashscreen/SplashScreen";
import AddProductSize from "./AddProductSize";
import EditProductSize from "./EditProductSize";

const ProductSizes = () => {
  const { itemId, page } = useParams();

  const [data, setData] = useState([]);

  const [modal, setModal] = useState(false);
  const [deleteId, setDeleteId] = useState(0);
  const [editId, setEditId] = useState(0);

  const [modalAddSize, setModalAddSize] = useState(false);
  const [modalEditSize, setModalEditSize] = useState(false);

  const [loading, setLoading] = useState(true);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  Modal.setAppElement("#root");

  useEffect(() => {
    getSizes(itemId);
  }, [modalAddSize, modalEditSize]);

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
                <td>{d.dimension}</td>
                <td>{d.weight}</td>
                <td>{d.price}</td>
                <td>{d.discount}</td>
                <td>{d.newPrice}</td>
                <td>{d.count}</td>
                <td>{d.inStock}</td>
                <td>
                  <button
                    className={styles.btn}
                    onClick={() => {
                      setEditId(d.id);
                      setModalEditSize(true);
                    }}
                  >
                    edit
                  </button>
                  {/* <Link
                    to={`/admin/editProductSize/${itemId}/${d.id}`}
                    className={styles.btn}
                  >
                    edit
                  </Link> */}
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
              {/* <Link
                to={`/admin/addProductSize/${itemId}`}
                style={{
                  textDecoration: "underline",
                  color: "#7dacee",
                  marginRight: "20px",
                }}
              >
                add
              </Link> */}
              <Link
                to={`/admin/products/${page}`}
                style={{
                  textDecoration: "underline",
                  color: "#7dacee",
                  margin: "0 4rem 0 2rem",
                }}
              >
                back
              </Link>
              <button
                className={styles.funcBtn}
                onClick={() => setModalAddSize(true)}
              >
                add
              </button>
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
      <Modal
        isOpen={modalAddSize}
        style={{
          overlay: {
            backgroundColor: "rgba(255,255,255,.8)",
          },
          content: {
            color: "lightsteelblue",
            backgroundColor: "rgb(32,32,32)",
          },
        }}
      >
        <AddProductSize
          productId={itemId}
          closeModal={() => {
            setModalAddSize(false);
          }}
        />
      </Modal>
      <Modal
        isOpen={modalEditSize}
        style={{
          overlay: {
            backgroundColor: "rgba(255,255,255,.8)",
          },
          content: {
            color: "lightsteelblue",
            backgroundColor: "rgb(32,32,32)",
          },
        }}
      >
        <EditProductSize
          productId={itemId}
          id={editId}
          closeModal={() => {
            setModalEditSize(false);
          }}
        />
      </Modal>
    </div>
  );
};

export default ProductSizes;
