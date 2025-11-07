import { useContext } from "react";
import styles from "./CategoryCard.module.css";
import { LanguageContext } from "../../../contexts/LanguageContext";
import { useParams } from "react-router-dom";

const CategoryCard = ({ category }) => {
  const {lang} = useParams();
  return (
    <div className={styles.content}>
      <img src={category.imgUrl} className={styles.img} />
      <div className={styles.overlay}></div>
      <div className={styles.title}>
        {lang === "en" && category.nameEn}
        {lang === "ka" && category.nameGe}
        {lang === "ru" && category.nameRu}
      </div>
    </div>
  );
};

export default CategoryCard;
