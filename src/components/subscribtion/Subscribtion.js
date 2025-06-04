import styles from "./Subscribtion.module.css";
import phoneIcon from "../../assets/phone.svg";

const Subscriber = () => {
  return (
    <div className={styles.block}>
      <div className={styles.content}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Enter emil address"
            className={styles.input}
          />
          <button className={styles.btn}>Subscribe</button>
        </div>

        <div className={styles.iconGroup}>
          <div className={styles.phone}>
            <img src={phoneIcon} />
          </div>
          <span className={styles.number}>032 2 20 46 60</span>
        </div>
      </div>
    </div>
  );
};

export default Subscriber;
