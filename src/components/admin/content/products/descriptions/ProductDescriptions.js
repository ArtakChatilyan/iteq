import { useEffect, useState } from "react";
import styles from "./../../View.module.css";
import { productsAPI } from "../../../dal/api";
import SplashScreen from "../../splashscreen/SplashScreen";
import collapseIcon from "../../../../../assets/circleArrow.png";
import AddDescription from "./AddDescription";
import EditDescription from "./EditDescription";
import LinkDescription from "./LinkDescriptions";
import { useCollapse } from "react-collapsed";

const ProductDescriptions = ({ productId }) => {

  const [loading, setLoading] = useState(true);
  const [isExpanded, setExpanded] = useState(false);
  const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded });

  const [descriptions, setDescriptions] = useState([]);
  const [selectedId, setSelectedId] = useState(0);
  const [modalAdd, setModalAdd] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalLink, setModalLink] = useState(false);

  useEffect(() => {
    getDescriptions(productId);
  }, []);

  const getDescriptions = (productId) => {
    productsAPI
      .getDescriptions(productId)
      .then((response) => setDescriptions(response.data.descriptions))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  };

  const reloadDescriptions = () => {
    getDescriptions(productId);
  };

  const closeModalHandle = () => {
    setModalAdd(false);
    setModalEdit(false);
    setModalLink(false);
    getDescriptions(productId);
  };

  const deleteItem = (id) => {
    setLoading(true);
    productsAPI
      .deleteDescription(id)
      .then((response) => {
        getDescriptions(productId);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false);
        setModalDelete(false);
      });
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
        <span>descriptions:</span>
        <img
          src={collapseIcon}
          style={{
            display: "inline-block",
            width: "28px",
            cursor: "pointer",
            transform: isExpanded ? "rotate(90deg)" : "",
          }}
          {...getToggleProps({
            onClick: () => setExpanded((prevExpanded) => !prevExpanded),
          })}
        />
      </div>
     
        <div {...getCollapseProps()} className={styles.data}>
          <table className={styles.table}>
            <tbody>
              <tr>
                <td colSpan={4} style={{ padding: "6px" }}>
                  <div className={`${styles.formItem}`} style={{ margin: 0 }}>
                    <button
                      className={styles.btn}
                      onClick={() => setModalAdd(true)}
                    >
                      add
                    </button>
                  </div>
                </td>
              </tr>
              {descriptions.map((d) => (
                <tr key={`d${d.id}`} className={styles.item}>
                  <td>{d.name}</td>
                  <td style={{ width: "140px" }}>
                    <button
                      className={styles.btn}
                      onClick={() => {
                        setSelectedId(d.id);
                        setModalLink(true);
                      }}
                    >
                      attachment
                    </button>
                  </td>
                  <td style={{ width: "140px" }}>
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
                  <td style={{ width: "140px" }}>
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
            <tfoot></tfoot>
          </table>
          {modalAdd && (
            <div>
              <AddDescription
                addDescription={reloadDescriptions}
                productId={productId}
                closeModal={() => setModalAdd(false)}
              />
            </div>
          )}
          {modalEdit && (
            <div>
              <EditDescription
                editDescription={reloadDescriptions}
                descriptionId={selectedId}
                closeModal={closeModalHandle}
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
          {modalLink && (
            <div>
              <LinkDescription
                productId={productId}
                descriptionId={selectedId}
                closeModal={closeModalHandle}
              />
            </div>
          )}
        </div>
     
    </div>
  );
};

export default ProductDescriptions;
