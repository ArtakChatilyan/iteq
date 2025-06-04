import styles from "./BrandCard.module.css";

const BrandCard = ({ brand }) => {
  return (
    <div className={styles.card}>
      <img src={brand.imgUrl} className={styles.img} />
    </div>
  );
};

export default BrandCard;
