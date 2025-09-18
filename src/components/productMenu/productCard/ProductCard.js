import styles from "./ProductCard.module.css";
import { ReactComponent as CartIcon } from "../../../assets/cartProduct.svg";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { LanguageContext } from "../../../contexts/LanguageContext";

const ProductCard = ({ product, withMargin }) => {
  const modelInfo = product.viewInfo;
  const priceInfo = modelInfo ? modelInfo.viewInfo : null;

  const { t, i18n } = useTranslation();
  const lang = useContext(LanguageContext);
  const marginStyle = { margin: withMargin ? "0 2rem" : "0 auto" };

  return (
    <div className={styles.card} style={marginStyle}>
      <span className={styles.stock}>
        {priceInfo && priceInfo.inStock ? (
          <span className={styles.inStock}>{t("inStock")}</span>
        ) : (
          <span>{t("unavailable")}</span>
        )}
      </span>

      <img src={product.imgUrl} className={styles.productImg} />

      <h4 className={styles.name}>
        {lang === "en" && product.productNameEn}
        {lang === "ge" && product.productNameGe}
        {lang === "ru" && product.productNameRu}
      </h4>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "end",
        }}
      >
        {modelInfo && (
          <span className={styles.model}>
            {lang === "en" && modelInfo.nameEn}
            {lang === "ge" && modelInfo.nameGe}
            {lang === "ru" && modelInfo.nameRu}
          </span>
        )}

        <div className={styles.iconsWrapper}>
          <span className={styles.cartWrapper}>
            <CartIcon className={styles.cart} onClick={() => {}} />
            {/* <PlusIcon className={styles.plus} /> */}
          </span>
          {/* <HeartIcon className={styles.like} onClick={() => {}} /> */}
        </div>
      </div>
      <div className={styles.info}>
        <span className={styles.price}>
          {priceInfo &&
            (priceInfo.discount ? (
              <span>
                <span className={styles.actual}>
                  {priceInfo.newPrice}&#8382;
                </span>
                <span className={styles.inActive}>
                  {priceInfo.price}&#8382;
                </span>
              </span>
            ) : (
              <span className={styles.actual}>{priceInfo.price}&#8382;</span>
            ))}
        </span>
        {/* <span className={styles.price}>{product.price}</span> */}

        <span className={styles.comparision}>
          <input
            type="checkbox"
            style={{ width: "11px", height: "11px", cursor: "pointer" }}
          />
          <span>{t("compare")}</span>
        </span>
      </div>
    </div>
  );
};

export default ProductCard;
