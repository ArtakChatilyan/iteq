import { useTranslation } from "react-i18next";
import styles from "./Account.module.css";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Password from "./password/Password";
import Orders from "./orders/Orders";
import Basket from "./basket/Basket";
import Purchases from "./purchases/Purchases";

const Account = ({ user, item }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const [itemIndexes] = useState([1, 2, 3, 4]);
  const [selectedItem, setSelectedItem] = useState(item || 1);

  useEffect(() => {
    if (location.pathname.endsWith("3")) {
      setSelectedItem(3);
    }
  }, [location.search]);

  const selectItem = (sItem) => {
    setSelectedItem(sItem);
  };

  return (
    <div className={styles.block}>
      <div className={styles.menuContainer}>
        <ul className={styles.menu}>
          <li
            key="item1"
            className={`${styles.menuItem} ${
              selectedItem === 1 ? styles.selected : ""
            }`}
            onClick={() => selectItem(1)}
          >
            {t("orders")}
          </li>

          <li
            key="item2"
            className={`${styles.menuItem} ${
              selectedItem === 2 ? styles.selected : ""
            }`}
            onClick={() => selectItem(2)}
          >
            {t("purchases")}
          </li>

          <li
            key="item3"
            className={`${styles.menuItem} ${
              selectedItem === 3 ? styles.selected : ""
            }`}
            onClick={() => selectItem(3)}
          >
            {t("basket")}
          </li>

          <li
            key="item4"
            className={`${styles.menuItem} ${
              selectedItem === 4 ? styles.selected : ""
            }`}
            onClick={() => selectItem(4)}
          >
            {t("settings")}
          </li>
        </ul>
      </div>

      <div className={styles.content}>
        {selectedItem == 1 && <Orders />}
        {selectedItem == 2 && <Purchases />}
        {selectedItem == 3 && <Basket userId={user.userId}/>}
        {selectedItem == 4 && <Password />}
      </div>
    </div>
  );
};

export default Account;
