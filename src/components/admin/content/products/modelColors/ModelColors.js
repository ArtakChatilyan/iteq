import { useEffect, useState } from "react";
import styles from "./../Products.module.css";
import { colorAPI } from "../../../dal/api";
import SplashScreen from "../../splashscreen/SplashScreen";

const ModelColors = ({ modelId, modelName, closeModal }) => {
  const [resultMessage, setResultMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [colors, setColors] = useState([]);
  const [resultData, setResultData] = useState([]);

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
        setResultMessage("Colors set successfully");
        closeModal();
      })
      .catch((error) => {
        setResultMessage("Failed set colors for model!");
      }).finally(()=>setLoading(false));
  };

  return (
    <div className={styles.data}>
      {loading && <SplashScreen />}
      <div className={styles.form}>
        <div style={{ borderRight: "1px solid rgb(81, 81, 81)" }}>
          <div className={styles.label} onClick={() => console.log(resultData)}>
            {modelName}
          </div>
        </div>

        <div>
          <div
            className={styles.formItem}
            style={{
              display: "flex",
              justifyContent: "center",
              maxHeight: "70vh",
              overflowY: "scroll",
            }}
          >
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
          </div>
        </div>

        <div className={`${styles.formItem} ${styles.col3}`}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <button className={styles.btn} onClick={()=>setModelColors(modelId)}>
              save
            </button>

            <button className={styles.btn} onClick={closeModal}>
              close
            </button>
          </div>
          {/* <button
            type="button"
            className={styles.btn}
            onClick={() => {
              return navigate(`/admin/products/${page}`);
            }}
          >
            cancel
          </button> */}
        </div>
        <div className={`${styles.formItem} ${styles.col3}`}>
          {resultMessage}
        </div>
      </div>
    </div>
  );
};

export default ModelColors;
