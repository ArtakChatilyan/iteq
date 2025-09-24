import styles from "../../View.module.css";
import { useEffect, useState } from "react";
import SplashScreen from "../../splashscreen/SplashScreen";
import AddModelSize from "./AddModelSize";
import EditModelSize from "./EditModelSize";
import { modelAPI } from "../../../dal/api";
import { useTranslation } from "react-i18next";

const ModelSizes = ({ modelId, closeModal }) => {
  const [data, setData] = useState([]);

  const [deleteId, setDeleteId] = useState(0);
  const [editId, setEditId] = useState(0);

  const [modalAdd, setModalAdd] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    getSizes(modelId);
  }, []);

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

  const reloadSizes = () => {
    getSizes(modelId);
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
            <th>{t("admin_size")}</th>
            <th>{t("admin_weight")}</th>
            <th>{t("admin_price")}</th>
            <th>{t("admin_discount")}</th>
            <th>{t("admin_newPrice")}</th>
            <th>{t("admin_count")}</th>
            <th>{t("admin_inStock")}</th>
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
                    {t("admin_edit")}
                  </button>
                </td>
                <td>
                  <button
                    className={styles.btn}
                    onClick={() => {
                      setDeleteId(d.id);
                      setModalDelete(true);
                    }}
                  >
                    {t("admin_delete")}
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
              <button className={styles.btn} onClick={() => setModalAdd(true)}>
                {t("admin_add")}
              </button>
              <button className={styles.btn} onClick={() => closeModal()}>
                {t("admin_close")}
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
              {t("admin_delete")}
            </button>
            <button
              className={styles.delBtn}
              onClick={() => setModalDelete(false)}
            >
              {t("admin_cancel")}
            </button>
          </div>
        </div>
      )}
      {modalAdd && (
        <AddModelSize
          modelId={modelId}
          sizeAdded={reloadSizes}
          closeModal={() => {
            setModalAdd(false);
          }}
        />
      )}
      {modalEdit && (
        <EditModelSize
          sizeId={editId}
          id={editId}
          sizeUpdated={reloadSizes}
          closeModal={() => {
            setModalEdit(false);
          }}
        />
      )}
    </div>
  );
};

export default ModelSizes;
