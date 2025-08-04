import styles from "../../View.module.css";
import { useEffect, useState } from "react";
import SplashScreen from "../../splashscreen/SplashScreen";
import { modelAPI } from "../../../dal/api";
import AddModel from "./AddModel";
import EditModel from "./EditModel";
import ModelColors from "../modelColors/ModelColors";
import ModelSizes from "../modelSizes/ModelSizes";
import collapseIcon from "../../../../../assets/circleArrow.png";
import { useCollapse } from "react-collapsed";

const Models = ({ productId }) => {
  const [isExpanded, setExpanded] = useState(false);
  const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded });
  const [loading, setLoading] = useState(true);

  const [models, setModels] = useState([]);

  const [modalAdd, setModalAdd] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  const [modalColor, setModalColor] = useState(false);

  const [modalSize, setModalSize] = useState(false);
  const [selectedId, setSelectedId] = useState(0);

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

  const reloadModels = () => {
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
    <div className={styles.dataExtra}>
      {loading && <SplashScreen />}
      <div
        className={styles.label}
        style={{
          display: "flex",
          alignContent: "center",
          justifyContent: "space-between",
          padding: "1rem 1rem",
        }}
      >
        <span>models:</span>
        <img
          {...getToggleProps({
            onClick: () => setExpanded((prevExpanded) => !prevExpanded),
          })}
          src={collapseIcon}
          style={{
            display: "inline-block",
            width: "28px",
            cursor: "pointer",
            transform: isExpanded ? "rotate(90deg)" : "",
          }}
        />
      </div>

      <div {...getCollapseProps()} className={styles.data}>
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
            <tr>
              <td colSpan={7}>
                <button
                  className={styles.btn}
                  onClick={() => {
                    setModalAdd(true);
                  }}
                >
                  add new model
                </button>
              </td>
            </tr>
            {models.map((m) => (
              <tr key={`m${m.id}`} >
                <td  colSpan={7}>
                  <table style={{width:"100%"}}>
                    <tbody>
                      <tr className={styles.item}>
                        <td>{m.nameEn}</td>
                        <td>{m.nameGe}</td>
                        <td>{m.nameRu}</td>
                        <td>
                          <button
                            className={styles.btn}
                            onClick={() => {
                              setSelectedId(m.id);
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
                      <tr>
                        <td colSpan={7} style={{ padding: 0 }}>
                          {modalSize && selectedId === m.id && (
                            <div
                              style={{
                                border: "1px solid rgba(255,255,255,.4)",
                                borderRadius:"10px",
                                width: "90%",
                                padding: "6px",
                                float: "right",
                              }}
                            >
                              <ModelSizes
                                modelId={selectedId}
                                closeModal={closeModalSize}
                              />
                            </div>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {modalAdd && (
          <div>
            <AddModel
              productId={productId}
              closeModal={() => setModalAdd(false)}
              reloadModels={reloadModels}
            />
          </div>
        )}
        {modalEdit && (
          <div>
            <EditModel
              modelId={selectedId}
              closeModal={() => setModalEdit(false)}
              reloadModels={reloadModels}
            />
          </div>
        )}
        {modalDelete && (
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
        )}
        {modalColor && (
          <div>
            {" "}
            <ModelColors modelId={selectedId} closeModal={closeModalColor} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Models;
