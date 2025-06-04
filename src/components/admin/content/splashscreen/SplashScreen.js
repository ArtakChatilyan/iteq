import styles from "./SplashScreen.module.css";
import loadingImg from "../../../../assets/loading.gif";

const SplashScreen = () => {
  return (
    
      <div className={styles.loadingWrapper}>
        <img src={loadingImg} className={styles.loading} />
      </div>
    
  );
};

export default SplashScreen;
