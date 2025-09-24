import styles from "../View.module.css";
import { useEffect, useState } from "react";
import SplashScreen from "../splashscreen/SplashScreen";
import { Link } from "react-router-dom";
import { colorAPI } from "../../dal/api";
import { useTranslation } from "react-i18next";

const Colors = () => {
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const [colors, setColors] = useState([]);
  const [modal, setModal] = useState(false);
  const [deleteId, setDeleteId] = useState(0);

  useEffect(() => {
    getColors();
  }, []);

  const getColors = () => {
    colorAPI
      .getColors()
      .then((response) => {
        setColors(response.data.colors);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false);
      });
  };

  const deleteItem = (id) => {
    setLoading(true);
    colorAPI
      .deleteColor(id)
      .then((response) => {
        window.location.reload(false);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className={styles.data}>
      {loading && <SplashScreen />}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>{t("admin_nameEn")}</th>
            <th>{t("admin_nameGe")}</th>
            <th>{t("admin_nameRu")}</th>
            <th>{t("admin_image")}</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {colors.length > 0 ? (
            colors.map((c) => (
              <tr key={`l${c.id}`} className={styles.item}>
                <td>{c.nameEn}</td>
                <td>{c.nameGe}</td>
                <td>{c.nameRu}</td>
                <td><img src={c.iconUrl} className={styles.img} /></td>
                <td>
                  <Link to={`/admin/editColor/${c.id}`} className={styles.btn}>
                    {t("admin_edit")}
                  </Link>
                </td>
                <td>
                  <button
                    className={styles.btn}
                    onClick={() => {
                      setDeleteId(c.id);
                      setModal(true);
                    }}
                  >
                    {t("admin_delete")}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>no data to preview</td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={6}>
              <Link
                to={`/admin/addColor`}
                style={{ textDecoration: "underline", color: "#7dacee" }}
              >
                {t("admin_add")}
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
              {t("admin_delete")}
            </button>
            <button className={styles.delBtn} onClick={() => setModal(false)}>
              {t("admin_cancel")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Colors;
