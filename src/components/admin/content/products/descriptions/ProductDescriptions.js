import { useEffect, useState } from "react";
import styles from "./../../View.module.css";
import { productsAPI } from "../../../dal/api";
import { Link, useNavigate, useParams } from "react-router-dom";

import Modal from "react-modal";
import SplashScreen from "../../splashscreen/SplashScreen";

import AddDescription from "./AddDescription";
import EditDescription from "./EditDescription";
import LinkDescription from "./LinkDescriptions";

const ProductDescriptions = () => {
  const { itemId, page } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [product, setProduct] = useState(null);
  const [descriptions, setDescriptions] = useState([]);
  const [selectedId, setSelectedId] = useState(0);
  const [modalAdd, setModalAdd] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalLink, setModalLink] = useState(false);

  // const [resultData, setResultData] = useState([]);
  // const [modalColorSize, setModalColorSize] = useState(false);

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
    getProduct(itemId);
    getDescriptions(itemId);
  }, []);

  const getProduct = (id) => {
    productsAPI
      .getProduct(id)
      .then((response) => {
        if (response) {
          setProduct(response.data.data);
        }
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  };

  const getDescriptions = (productId) => {
    productsAPI
      .getDescriptions(productId)
      .then((response) => setDescriptions(response.data.descriptions))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  };

  const closeModalHandle = () => {
    setModalAdd(false);
    setModalEdit(false);
    setModalLink(false);
    getDescriptions(itemId);
  };

  const deleteItem = (id) => {
    productsAPI
      .deleteDescription(id)
      .then((response) => {
        getDescriptions(itemId);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false);
        setModalDelete(false);
      });
  };

  return (
    <div className={styles.data}>
      {loading && <SplashScreen />}

      <table className={styles.table}>
        <thead>
          <tr>
            <th colSpan={4}>{product && product.productNameEn}</th>
          </tr>
          <tr>
            <th>description name</th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {descriptions.map((d) => (
            <tr key={`d${d.id}`} className={styles.item}>
              <td>{d.name}</td>
              <td>
                <button
                  className={styles.btn}
                  onClick={() => {
                    setSelectedId(d.id);
                    setModalLink(true);
                  }}
                >
                  model-color-aize
                </button>
              </td>
              <td>
                <button
                  className={styles.btn}
                  onClick={() => {
                    setSelectedId(d.id);
                    setModalEdit(true);
                  }}
                >
                  edit
                </button>
              </td>
              <td>
                <button
                  className={styles.btn}
                  onClick={() => {
                    setSelectedId(d.id);
                    setModalDelete(true);
                  }}
                >
                  delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4}>
              <div className={`${styles.formItem}`}>
                <button
                  className={styles.btn} style={{marginRight: "16px"}}
                  onClick={() => setModalAdd(true)}
                >
                  add
                </button>
                <button
                  type="button"
                  className={styles.btn}
                  onClick={() => {
                    return navigate(`/admin/products/${page}`);
                  }}
                >
                  cancel
                </button>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
      <Modal
        isOpen={modalLink}
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
        <LinkDescription productId={itemId} descriptionId={selectedId} closeModal={closeModalHandle} />
      </Modal>
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
        <AddDescription productId={itemId} closeModal={closeModalHandle} />
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
        <EditDescription
          descriptionId={selectedId}
          closeModal={closeModalHandle}
        />
      </Modal>
      <Modal
        isOpen={modalDelete}
        style={{
          overlay: {
            backgroundColor: "rgba(255,255,255,0.4)",
          },
          content: {
            color: "lightsteelblue",
            backgroundColor: "rgba(32,32,32,.4)",
          },
        }}
      >
        <div className={styles.modal}>
          <div className={styles.btnGroup}>
            <button
              className={styles.delBtn}
              onClick={() => {
                deleteItem(selectedId);
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
      </Modal>
    </div>
  );
};

export default ProductDescriptions;
