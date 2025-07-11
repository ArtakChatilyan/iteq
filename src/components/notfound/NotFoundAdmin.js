import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";
import backImage from "../../assets/backImage.png";

const NotFoundAdmin = () => {
  return (
    <div className={styles.blockAdmin}>
      <div className={styles.title}>Page Not Found</div>
      <Link to="/admin" className={styles.link}>
        to main
      </Link>
    </div>
  );
};

export default NotFoundAdmin;
