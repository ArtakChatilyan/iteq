import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";
import backImage from "../../assets/backImage.png";

const NotFound = () => {
  return (
    <div className={styles.block}>
      <div className={styles.title}>Page Not Found</div>
      <Link to="/" className={styles.link}>
        to main
      </Link>
    </div>
  );
};

export default NotFound;
