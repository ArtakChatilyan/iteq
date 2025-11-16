import { useContext, useEffect, useState } from "react";
import styles from "./BasketCard.module.css";
import { basketAPI } from "../../dalUser/userApi";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../../../contexts/LanguageContext";
import trashIcon from "../../../assets/trash-delete.svg";

const BasketCard = ({ basket, deleteBasket, setCount, checkBasket }) => {
  const [model, setModel] = useState(null);
  const [selectedCount, setSelectedCount] = useState(basket.count);
  const [isChecked, setIsChecked] = useState(true);
  // const [alertOnCount, setAlertOnCount] = useState(false);

  useEffect(() => {
    setModel(basket.modelInfo);
    // setAlertOnCount(selectedCount > basket.modelInfo.count);
  }, [basket]);

  const setBasketCount = (count) => {
      basketAPI
        .updateBasketCount(basket.id, count)
        .then((response) => {
          setSelectedCount(count);
          setCount(basket.id, count);
        })
        .catch((error) => console.log(error))
        .finally(() => {});
  };

  const { t, i18n } = useTranslation();
  const lang = useContext(LanguageContext);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
    checkBasket(basket.id, event.target.checked);
  };

  return (
    <div className={styles.block}>
      <input
        type="checkbox"
        className={styles.check}
        checked={isChecked}
        onChange={handleCheckboxChange}
      />
      <div className={styles.card}>
        <div className={styles.img}>
          <img src={basket.image.imgUrl} />
        </div>
        <div className={styles.infoContent}>
          <span className={styles.title}>
            {lang === "en" && basket.productInfo[0].productNameEn}
            {lang === "ka" && basket.productInfo[0].productNameGe}
            {lang === "ru" && basket.productInfo[0].productNameRu}
          </span>
          <span className={`${styles.info} ${styles.infoLight}`}>
            {model && lang === "en" && model.modelNameEn}
            {model && lang === "ka" && model.modelNameGe}
            {model && lang === "ru" && model.modelNameRu}
          </span>
          <span className={styles.info}>{basket.productInfo[0].brandName}</span>
          {model && model.colorId && (
            <div className={styles.detail}>
              <span className={styles.label}>{t("color")}</span>
              {lang === "en" && model.colorNameEn}
              {lang === "ka" && model.colorNameGe}
              {lang === "ru" && model.colorNameRu}
            </div>
          )}
          {model && model.sizeId && (
            <div className={styles.detail}>
              <div>
                <span className={styles.label}>{t("dimension")}</span>
                <span>{model.dimension}</span>
              </div>
              <div>
                <span className={styles.label}>{t("weight")}</span>
                <span>{model.weight}</span>
              </div>
            </div>
          )}
        </div>
        <div className={`${styles.contentEnd}`}>
          <div className={`${styles.title} ${styles.titleLight}`}>
            {model &&
              (model.discount
                ? model.newPrice * selectedCount
                : model.price * selectedCount)}
            &#8382;
          </div>
          <input
            className={styles.input}
            value={selectedCount}
            type="number"
            min={1}
            // max={model && model.count}
            onChange={(e) => {
              setBasketCount(e.currentTarget.value);
              // if (parseInt(e.currentTarget.value) > model.count) {
              //   e.currentTarget.value = model.count;
              //   setBasketCount(model.count);
              // } else {
                
              //   setBasketCount(e.currentTarget.value);
              // }
              // setAlertOnCount(false);
            }}
          />
          <div style={{ textAlign: "center", flexGrow: 1 }}>
            {/* <span
              style={{
                paddingBottom:"1rem",
                display: "inline-block",
                width: "80%",
                borderBottom: alertOnCount ? "2px solid red" : "none",
              }}
            >
              {" "}
              max: {model && model.count}
            </span> */}
          </div>
          <div>
            <img
              src={trashIcon}
              className={styles.deleteIcon}
              onClick={() => deleteBasket(basket.id)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasketCard;
