import { useTranslation } from "react-i18next";
import styles from "./Account.module.css";
import { useEffect, useState } from "react";
import {
  Navigate,
  NavLink,
  Outlet,
  useLocation,
  useParams,
} from "react-router-dom";

const Account = ({ userId }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  if (location.pathname === "/account")
    return <Navigate to={`/account/basket/${userId}`} />;

  return (
    <div className={styles.block}>
      <div className={styles.menuContainer}>
        <ul className={styles.menu}>
          <li>
            <NavLink
              to={`/account/basket/${userId}`}
              className={({ isActive }) =>
                `${styles.menuItem} ${isActive ? styles.selected : ""}`
              }
            >
              {t("basket")}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/account/orders/${userId}`}
              className={({ isActive }) =>
                `${styles.menuItem} ${isActive ? styles.selected : ""}`
              }
            >
              {t("orders")}
            </NavLink>
          </li>

          <li>
            <NavLink
              to={`/account/orderHistory/${userId}`}
              className={({ isActive }) =>
                `${styles.menuItem} ${isActive ? styles.selected : ""}`
              }
            >
              {t("purchases")}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/account/settings/${userId}`}
              className={({ isActive }) =>
                `${styles.menuItem} ${isActive ? styles.selected : ""}`
              }
            >
              {t("settings")}
            </NavLink>
          </li>
        </ul>
      </div>

      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};

export default Account;
