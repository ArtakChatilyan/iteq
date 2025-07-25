import { useEffect, useState } from "react";
import styles from "./ModelColorSize.module.css";
import SplashScreen from "../splashscreen/SplashScreen";
import { colorAPI, modelAPI } from "../../dal/api";

const ModelColorSize = ({ productId, imageId, product, closeModal }) => {
  const [loading, setLoading] = useState(true);

  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(0);
  const [colors, setColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [resultData, setResultData] = useState([]);
  const [resultMessage, setResultMessage] = useState("");

  const [deleteId, setDeleteId] = useState(0);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    LoadModels(productId);
  }, []);

  const LoadModels = (productId) => {
    modelAPI
      .getModels(productId)
      .then((response) => {
        if (response.data.models.length > 0)
          setSelectedModel(response.data.models[0].id);
        setModels(response.data.models);
      })
      .catch((error) => console.log(error))
      .finally(() => {});
  };

  useEffect(() => {
    LoadModelColors(selectedModel);
    LoadModelSizes(selectedModel);
    LoadImageColorSize(selectedModel, imageId);
  }, [selectedModel]);

  const LoadModelColors = (modelId) => {
    colorAPI
      .getModelColors(modelId)
      .then((response) => {
        setColors(response.data.mColors);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false);
      });
  };

  const LoadModelSizes = (modelId) => {
    modelAPI
      .getSizes(modelId)
      .then((response) => {
        if (response) {
          setSizes(response.data.data);
        }
      })
      .catch((error) => console.log(error))
      .finally(() => {});
  };

  const LoadImageColorSize = (modelId, imageId) => {
    modelAPI
      .getImageColorSize(modelId, imageId)
      .then((response) => {
        setResultData(response.data.colorSize);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false);
      });
  };

  const setColorSize = () => {
    setLoading(true);
    modelAPI
      .setImageColorSize({
        imageId,
        modelId: selectedModel,
        color: selectedColor ? selectedColor.substring(3) : 0,
        size: selectedSize ? selectedSize.substring(3) : 0,
      })
      .then((data) => {
        LoadImageColorSize(selectedModel, imageId);
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
    modelAPI
      .deleteImageColorSize(deleteId)
      .then((data) => {
        LoadImageColorSize(selectedModel, imageId);
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
        <div className={styles.modelContent}>
          {models.map((m) => (
            <div
              className={`${styles.modelItem} ${
                m.id === selectedModel ? styles.selectedModel : ""
              }`}
              onClick={() => setSelectedModel(m.id)}
            >
              {m.nameEn}
            </div>
          ))}
        </div>
        <div className={styles.modelContent}>
          {colors.map((cd) => (
            <div
              key={`kl${cd.colorId}`}
              className={`${styles.itemWrapper} ${styles.checkBoxWrapper}`}
            >
              <input
                type="radio"
                value={`ch_${cd.colorId}`}
                name="color"
                checked={selectedColor===`ch_${cd.colorId}`}
                onChange={(e) => setSelectedColor(e.currentTarget.value)}
              />{" "}
              {cd.nameRu}
            </div>
          ))}
        </div>
        <div className={styles.modelContent}>
          {sizes.map((sd) => (
            <div
              key={`f${sd.id}`}
              className={`${styles.itemWrapper} ${styles.checkBoxWrapper}`}
            >
              <input
                type="radio"
                value={`ch_${sd.id}`}
                name="size"
                checked={selectedSize===`ch_${sd.id}`}
                onChange={(e) => setSelectedSize(e.currentTarget.value)}
              />{" "}
              {sd.dimension}
            </div>
          ))}
        </div>
        <div className={styles.modelContent}>
          {resultData.map((rd) => (
            <div
              key={`p${rd.id}`}
              className={`${styles.itemWrapper} ${styles.checkBoxWrapper}`}
            >
              {rd.colorId && (
                <span>
                  {colors.find((c) => c.colorId == rd.colorId) &&
                    colors.find((c) => c.colorId == rd.colorId).nameRu}
                </span>
              )}
              {rd.sizeId && (
                <span style={{ margin: "0 1rem", gridColumn: "2" }}>
                  {sizes.find((s) => s.id == rd.sizeId) &&
                    sizes.find((s) => s.id == rd.sizeId).dimension}
                </span>
              )}
              <button
                className={styles.btnLink}
                style={{gridColumn: "3"}}
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
        <button className={styles.btn} onClick={()=>{
            setSelectedColor(null);
            setSelectedSize(null);
        }}>
          reset
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

export default ModelColorSize;
