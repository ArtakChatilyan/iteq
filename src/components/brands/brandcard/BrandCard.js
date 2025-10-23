import { Link } from "react-router-dom";
import styles from "./BrandCard.module.css";

const BrandCard = ({ brand }) => {
  return (
    <div className={styles.card}>
      <Link to={`/brands/${brand.id}`}>
        <img src={brand.imgUrl} className={styles.img} />
      </Link>
    </div>
  );
};

export default BrandCard;
