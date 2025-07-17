import styles from "../../View.module.css";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Modal from "react-modal";
import SplashScreen from "../../splashscreen/SplashScreen";
import { modelAPI } from "../../../dal/api";
import AddModel from "./AddModel";
import EditModel from "./EditModel";
import ModelColors from "../modelColors/ModelColors";
import ModelSizes from "../modelSizes/ModelSizes";

const Models = () => {
  const { page, productId,sType, sTerm } = useParams();
  const [loading, setLoading] = useState(true);

  const [models, setModels] = useState([]);

  const [modalAdd, setModalAdd] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  //const [editId, setEditId] = useState(0);
  //const [deleteId, setDeleteId] = useState(0);

  const [modalColor, setModalColor] = useState(false);
  const [selectedModelName, setSelectedModelName]=useState('');
  //const [colorId, setColorId] = useState(0);

  const [modalSize, setModalSize]=useState(false);
  const [selectedId, setSelectedId]=useState(0);
  Modal.setAppElement("#root");

  useEffect(() => {
    getModels(productId);
  }, []);

  const getModels = (productId) => {
    modelAPI
      .getModels(productId)
      .then((response) => {
        if (response) {
          setModels(response.data.models);
        }
        setLoading(false);
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  };

  const closeModalHandle = () => {
    setModalAdd(false);
    setModalEdit(false);
    getModels(productId);
  };

  const closeModalColor = () => {
    setModalColor(false);
  };

  const closeModalSize = () => {
    setModalSize(false);
  };

  const deleteItem = (id) => {
    setLoading(true);
    modelAPI
      .deleteModel(id)
      .then((response) => {
        setModalDelete(false);
        getModels(productId);
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
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
            <th></th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {models.map((m) => (
            <tr key={`m${m.id}`} className={styles.item}>
              <td>{m.nameEn}</td>
              <td>{m.nameGe}</td>
              <td>{m.nameRu}</td>
              <td>
                <button
                  className={styles.btn}
                  onClick={() => {
                    setSelectedId(m.id);
                    setSelectedModelName(m.nameEn);
                    setModalColor(true);
                  }}
                >
                  colors
                </button>
              </td>
              <td>
                <button
                  className={styles.btn}
                  onClick={() => {
                    setSelectedId(m.id);
                    setSelectedModelName(m.nameEn);
                    setModalSize(true);
                  }}
                >
                  sizes
                </button>
              </td>
              <td>
                <button
                  className={styles.btn}
                  onClick={() => {
                    setSelectedId(m.id);
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
                    setSelectedId(m.id);
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
            <td colSpan={7}>
              <Link
                to={`/admin/products/${page}/${sType}/${sTerm}`}
                style={{
                  textDecoration: "underline",
                  color: "#7dacee",
                  margin: "0 4rem 0 2rem",
                }}
              >
                back
              </Link>
              <button
                className={styles.btn}
                onClick={() => {
                  setModalAdd(true);
                }}
              >
                add
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
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
        <AddModel productId={productId} closeModal={closeModalHandle} />
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
        <EditModel modelId={selectedId} closeModal={closeModalHandle} />
      </Modal>
      <Modal
        isOpen={modalColor}
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
        <ModelColors modelId={selectedId} modelName={selectedModelName} closeModal={closeModalColor} />
      </Modal>
      <Modal
        isOpen={modalSize}
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
        <ModelSizes modelId={selectedId} modelName={selectedModelName} closeModal={closeModalSize} />
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

export default Models;
