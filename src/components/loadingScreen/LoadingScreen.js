import styles from "./LoadingScreen.module.css";
import loadingImg from "../../assets/loading.gif";

const LoadingScreen = ({ showGif }) => {
  return (
    <div className={styles.loadingWrapper}>
      {showGif && <img src={loadingImg} className={styles.loading} />}
    </div>
  );
};

export default LoadingScreen;
