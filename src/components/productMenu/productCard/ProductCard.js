import styles from "./ProductCard.module.css";
import { ReactComponent as CartIcon } from "../../../assets/cartProduct.svg";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { LanguageContext } from "../../../contexts/LanguageContext";

const ProductCard = ({ product }) => {
  const { t, i18n } = useTranslation();
  const lang = useContext(LanguageContext);

  return (
    <div className={styles.card}>
      <span className={styles.stock}>
        {product.productInStock ? (
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
      <span className={styles.model}>{product.productModel}</span>

      <div className={styles.iconsWrapper}>
        <span className={styles.cartWrapper}>
          <CartIcon className={styles.cart} onClick={() => {}} />
          {/* <PlusIcon className={styles.plus} /> */}
        </span>
        {/* <HeartIcon className={styles.like} onClick={() => {}} /> */}
      </div>

      <div className={styles.info}>
        <span className={styles.price}>
          {product.productDiscount ? (
            <span>
              <span className={styles.actual}>
                {product.productNewPrice}&#8382;
              </span>
              <span className={styles.inActive}>
                {product.productPrice}&#8382;
              </span>
            </span>
          ) : (
            <span className={styles.actual}>{product.productPrice}&#8382;</span>
          )}
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
