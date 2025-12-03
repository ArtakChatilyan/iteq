import { useContext } from "react";
import styles from "./CategoryCard.module.css";
import { LanguageContext } from "../../../contexts/LanguageContext";
import { useParams } from "react-router-dom";

const CategoryCard = ({ category }) => {
  const { lang } = useParams();
  return (
    <div className={styles.content}>
      <img
        src={category.imgUrl}
        className={styles.img}
        alt={
          lang === "en"
            ? category.nameEn
            : lang === "ka"
            ? category.nameGe
            : category.nameRu
        }
      />
      <div className={styles.overlay}></div>
      <h2 className={styles.title}>
        {lang === "en" && category.nameEn}
        {lang === "ka" && category.nameGe}
        {lang === "ru" && category.nameRu}
      </h2>
    </div>
  );
};

export default CategoryCard;
