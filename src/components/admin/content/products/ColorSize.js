import { useEffect, useState } from "react";
import styles from "./ColorSize.module.css";
import SplashScreen from "../splashscreen/SplashScreen";
import { colorAPI, productsAPI } from "../../dal/api";

const ColorSize = ({ productId, imageId, product, closeModal }) => {
  const [loading, setLoading] = useState(true);
  const [colorData, setColorData] = useState([]);
  const [sizeData, setSizeData] = useState([]);
  const [resultData, setResultData] = useState([]);
  const [resultMessage, setResultMessage] = useState("");

  const [color, setColor] = useState(0);
  const [size, setSize] = useState(0);

  const [deleteId, setDeleteId] = useState(0);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    LoadColors(product.id);
    LoadSizes(productId);
    LoadColorSize(imageId);
  }, []);

  const LoadColors = (id) => {
    colorAPI
      .getProductColors(id)
      .then((response) => {
        console.log(response);
        
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
        setResultData(response.data.colorSize);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false);
      });
  };

  const setColorSize = () => {
    if (color === 0 && size === 0) return;
    setLoading(true);
    productsAPI
      .setImageColorSize({ imageId, color, size })
      .then((data) => {
        LoadColorSize(imageId);
      })
      .catch((error) => {
        setResultMessage("Failed to add color/size!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const deleteItem = (deleteId) => {
    setLoading(true);
    productsAPI
      .deleteImageColorSize(deleteId)
      .then((data) => {
        LoadColorSize(imageId);
        setModal(false);
      })
      .catch((error) => {
        setResultMessage("Failed to delete color/size!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className={styles.block}>
      {loading && <SplashScreen />}
      <div className={styles.itemContent}>
        {product.productMultyColor && (
          <div>
            {colorData.map((cd) => (
              <div
                key={`kl${cd.id}`}
                className={`${styles.itemWrapper} ${styles.checkBoxWrapper}`}
              >
                <input
                  type="radio"
                  value={`ch_${cd.id}`}
                  name="color"
                  onChange={(e) => setColor(e.currentTarget.value)}
                />{" "}
                {cd.nameRu}
              </div>
            ))}
          </div>
        )}
        {product.productMultyDimension && (
          <div>
            {sizeData.map((sd) => (
              <div
                key={`f${sd.id}`}
                className={`${styles.itemWrapper} ${styles.checkBoxWrapper}`}
              >
                <input
                  type="radio"
                  value={`ch_${sd.id}`}
                  name="size"
                  onChange={(e) => setSize(e.currentTarget.value)}
                />{" "}
                {sd.dimension}
              </div>
            ))}
          </div>
        )}
        <div>
          {resultData.map((rd) => (
            <div
              key={`p${rd.id}`}
              className={`${styles.itemWrapper} ${styles.checkBoxWrapper}`}
            >
              {rd.colorId && (
                <span>{colorData.find((c) => c.id == rd.colorId).nameRu}</span>
              )}
              {rd.sizeId && (
                <span style={{ margin: "0 3rem 0 2rem" }}>
                  {sizeData.find((s) => s.id == rd.sizeId).dimension}
                </span>
              )}

              <button
                className={styles.btnLink}
                onClick={() => {
                  setDeleteId(rd.id);
                  setModal(true);
                }}
              >
                delete
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.btnGroup}>
        <button className={styles.btn} onClick={setColorSize}>
          add
        </button>
        <button className={styles.btn} onClick={closeModal}>
          close
        </button>
      </div>
      <div className={styles.error}>{resultMessage}</div>

      {modal && (
        <div className={styles.modal}>
          <div className={`${styles.btnGroup} ${styles.modalGroup}`}>
            <button
              className={styles.delBtn}
              onClick={() => {
                deleteItem(deleteId);
              }}
            >
              delete
            </button>
            <button className={styles.delBtn} onClick={() => setModal(false)}>
              cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorSize;
