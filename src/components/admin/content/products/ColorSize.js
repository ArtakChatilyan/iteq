import { useEffect, useState } from "react";
import styles from "./Products.module.css";
import SplashScreen from "../splashscreen/SplashScreen";
import { colorAPI, productsAPI } from "../../dal/api";

const ColorSize = ({ productId, imageId, closeModal }) => {
  const [loading, setLoading] = useState(true);
  const [colorData, setColorData] = useState([]);
  const [sizeData, setSizeData] = useState([]);
  const [resultData, setResultData] = useState([]);
  const [resultMessage, setResultMessage] = useState("");

  useEffect(() => {
    LoadColors();
    LoadSizes(productId);
    LoadColorSize(imageId);
  }, []);

  const LoadColors = () => {
    colorAPI
      .getColors()
      .then((response) => {
        setColorData(response.data.colors);
      })
      .catch((error) => console.log(error))
      .finally(() => {});
  };

  const LoadSizes = (itemId) => {
    productsAPI
      .getSizes(itemId)
      .then((response) => {
        setSizeData(response.data.data);
      })
      .catch((error) => console.log(error));
  };

  const LoadColorSize = (imageId) => {
    productsAPI
      .getImageColorSize(imageId)
      .then((response) => {
        console.log(response.data.colorSize);
        response.data.colorSize.forEach((el) => {
          setResultData((d) => {
            return [...d, { cId: el.colorId, sId: el.sizeId }];
          });
        });
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false);
      });
  };

  const setColorSize = () => {
    //   setLoading(true);
    //   categoryAPI
    //     .setCategoryBrands(categoryId, resultData)
    //     .then((data) => {
    //       closeModal();
    //     })
    //     .catch((error) => {
    //       setResultMessage("Couldn't set brands for category!");
    //     });
  };

  const checkHandle = (e) => {
    // const val = parseInt(e.target.name.substring(3));
    // if (e.currentTarget.checked) {
    //   setResultData((data) => [...data, val]);
    // } else {
    //   setResultData((data) => [...data.filter((d) => d != val)]);
    // }
  };
  return (
    <div className={styles.block}>
      {loading && <SplashScreen />}

      <div className={styles.itemContent}>
        {colorData.map((cd) => (
          <div
            key={`d${cd.id}`}
            className={`${styles.itemWrapper} ${styles.checkBoxWrapper}`}
          >
            <input
              type="checkbox"
              onChange={checkHandle}
              name={`ch_${cd.id}`}
              checked={resultData.includes(cd.id) ? true : false}
              style={{ width: "20px", height: "20px", cursor: "pointer" }}
            />
            <span style={{ margin: "10px", textWrap: "nowrap" }}>
              {cd.nameRu}
            </span>
          </div>
        ))}
      </div>
      <div className={styles.itemContent}>
        {sizeData.map((sd) => (
          <div
            key={`d${sd.id}`}
            className={`${styles.itemWrapper} ${styles.checkBoxWrapper}`}
          >
            <input
              type="checkbox"
              onChange={checkHandle}
              name={`ch_${sd.id}`}
              checked={resultData.includes(sd.id) ? true : false}
              style={{ width: "20px", height: "20px", cursor: "pointer" }}
            />
            <span style={{ margin: "10px", textWrap: "nowrap" }}>
              {sd.dimension}
            </span>
          </div>
        ))}
      </div>
      <div className={styles.btnGroup}>
        <button className={styles.btn} onClick={setColorSize}>
          save
        </button>
        <button className={styles.btn} onClick={closeModal}>
          cancel
        </button>
      </div>
      <div className={styles.error}>{resultMessage}</div>
    </div>
  );
};

export default ColorSize;
