import { useEffect, useState } from "react";
import styles from "./../Products.module.css";
import { colorAPI } from "../../../dal/api";
import SplashScreen from "../../splashscreen/SplashScreen";
import { useTranslation } from "react-i18next";

const ModelColors = ({ modelId, closeModal }) => {
  const [resultMessage, setResultMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [colors, setColors] = useState([]);
  const [resultData, setResultData] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    getColors();
    getColorsForModels(modelId);
  }, []);

  const getColors = () => {
    colorAPI
      .getColors()
      .then((response) => {
        setColors(response.data.colors);
      })
      .catch((error) => console.log(error))
      .finally(() => {});
  };

  const getColorsForModels = (id) => {
    colorAPI
      .getModelColors(id)
      .then((response) => {
        response.data.mColors.forEach((el) => {
          setResultData((d) => {
            return [...d, el.colorId];
          });
        });
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false);
      });
  };

  const checkHandle = (e) => {
    const val = parseInt(e.target.name.substring(3));
    if (e.currentTarget.checked) {
      setResultData((data) => [...data, val]);
    } else {
      setResultData((data) => [...data.filter((d) => d != val)]);
    }
  };

  const setModelColors = (modelId) => {
    setLoading(true);
    colorAPI
      .setModelColors(modelId, resultData)
      .then((response) => {
        setResultMessage(t("admin_colorsSetSuccess"));
      })
      .catch((error) => {
        setResultMessage(t("admin_colorsSetFailed"));
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className={styles.data}>
      {loading && <SplashScreen />}
      <div className={styles.form}>
        <div className={styles.itemContent}>
          {colors.map((c) => (
            <div
              key={`d${c.id}`}
              className={`${styles.itemWrapper} ${styles.checkBoxWrapper}`}
            >
              <input
                type="checkbox"
                onChange={checkHandle}
                name={`ch_${c.id}`}
                checked={resultData.includes(c.id) ? true : false}
                style={{ width: "20px", height: "20px", cursor: "pointer" }}
              />
              <span style={{ margin: "10px", textWrap: "nowrap" }}>
                {c.nameRu}
              </span>
            </div>
          ))}
        </div>

        <div className={``}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <button
              className={styles.btn}
              onClick={() => setModelColors(modelId)}
            >
              {t("admin_save")}
            </button>

            <button className={styles.btn} onClick={closeModal}>
              {t("admin_close")}
            </button>
          </div>
        </div>
        <div className={`${styles.formItem} ${styles.col3}`}>
          {resultMessage}
        </div>
      </div>
    </div>
  );
};

export default ModelColors;
