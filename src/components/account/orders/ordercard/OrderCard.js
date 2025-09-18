import { useContext, useEffect, useState } from "react";
import styles from "./OrderCard.module.css";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../../../../contexts/LanguageContext";

const OrderCard = ({ order, allowCancel, cancelOrder }) => {
  const [model, setModel] = useState(null);

  useEffect(() => {
    setModel(order.modelInfo);
  }, [order]);

  const { t, i18n } = useTranslation();
  const lang = useContext(LanguageContext);

  return (
    <div className={styles.block}>
      <div className={styles.card}>
        <div className={styles.img}>
          <img src={order.image.imgUrl} />
        </div>
        <div className={styles.infoContent}>
          <span className={styles.title}>
            {lang === "en" && order.productInfo[0].productNameEn}
            {lang === "ge" && order.productInfo[0].productNameGe}
            {lang === "ru" && order.productInfo[0].productNameRu}
          </span>
          <span className={`${styles.info} ${styles.infoLight}`}>
            {model && lang === "en" && model.modelNameEn}
            {model && lang === "ge" && model.modelNameGe}
            {model && lang === "ru" && model.modelNameRu}
          </span>
          <span className={styles.info}>{order.productInfo[0].brandName}</span>
          {model && model.colorId && (
            <div className={styles.detail}>
              <span className={styles.label}>{t("color")}</span>
              {lang === "en" && model.colorNameEn}
              {lang === "ge" && model.colorNameGe}
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
          <div className={styles.detail}>
            <span className={styles.label}>{t("count")}</span>
            <span> {order.count}</span>
          </div>
          <div className={styles.detail}>
            <span className={styles.label}>{t("price")}</span>
            <span> {order.price}&#8382;</span>
          </div>
        </div>
        <div className={`${styles.contentEnd}`}>
          <div className={`${styles.title} ${styles.titleLight}`}>
            {order.price * order.count}
            &#8382;
          </div>
        </div>
      </div>
      {allowCancel &&
        (order.state === 1 ? (
          <span className={styles.info}>pending cancelation</span>
        ) : (
          <button className={styles.btn} onClick={()=>cancelOrder(order.id)}>cancel order</button>
        ))}
    </div>
  );
};

export default OrderCard;
