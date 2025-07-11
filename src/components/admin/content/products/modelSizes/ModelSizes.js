import styles from "../../View.module.css";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import SplashScreen from "../../splashscreen/SplashScreen";
import AddModelSize from "./AddModelSize";
import EditModelSize from "./EditModelSize";
import { modelAPI } from "../../../dal/api";

const ModelSizes = ({ modelId, modelName, closeModal }) => {
  const [data, setData] = useState([]);

  const [deleteId, setDeleteId] = useState(0);
  const [editId, setEditId] = useState(0);

  const [modalAdd, setModalAdd] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

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
    getSizes(modelId);
  }, [modalAdd, modalEdit]);

  const getSizes = (id) => {
    modelAPI
      .getSizes(id)
      .then((response) => {
        if (response) {
          setData(response.data.data);
        }
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false);
      });
  };

  const deleteItem = (id) => {
    
    setLoading(true);
    modelAPI
      .deleteSize(id)
      .then((data) => {
        setModalDelete(false);
        getSizes(modelId);
      })
      .catch((error) => console.log(error))
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
            <th>size</th>
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
                      setModalEdit(true);
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
                      setModalDelete(true);
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
              <button className={styles.funcBtn} onClick={() => closeModal()}>
                close
              </button>
              <button
                className={styles.funcBtn}
                onClick={() => setModalAdd(true)}
              >
                add
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
      {modalDelete && (
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
            <button
              className={styles.delBtn}
              onClick={() => setModalDelete(false)}
            >
              cancel
            </button>
          </div>
        </div>
      )}
      <Modal
        isOpen={modalAdd}
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
        <AddModelSize
          modelId={modelId}
          closeModal={() => {
            setModalAdd(false);
          }}
        />
      </Modal>
      <Modal
        isOpen={modalEdit}
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
        <EditModelSize
          sizeId={editId}
          id={editId}
          closeModal={() => {
            setModalEdit(false);
          }}
        />
      </Modal>
    </div>
  );
};

export default ModelSizes;
