import { Link, useParams } from "react-router-dom";
import styles from "./BrandCard.module.css";

const BrandCard = ({ brand }) => {
  const {lang}=useParams();
  return (
    <div className={styles.card}>
      <Link to={`/${lang}/brands/${brand.id}`}>
        <img src={brand.imgUrl} className={styles.img} />
      </Link>
    </div>
  );
};

export default BrandCard;
