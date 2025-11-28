import { Link, NavLink, Outlet } from "react-router-dom";
import Cookies from "universal-cookie";
import styles from "./Admin.module.css";
import { useContext, useEffect, useState } from "react";
import i18n from "../../../localization/i18n";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../../../contexts/LanguageContext";
import { Helmet } from "react-helmet-async";
import { AdminChatContext } from "../../../contexts/AdminSSEContext";

const Admin = ({ logout, orderCount, canceledOrderCount }) => {
  const { hasGlobalUnread } = useContext(AdminChatContext);
  const cookies = new Cookies(null, { path: "/" });
  const [language, setLanguage] = useState(null);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    cookies.set("langIteq", lang, {
      expires: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000),
    });
    setLanguage(lang);
  };

  useEffect(() => {
    let lang = cookies.get("langIteq");

    if (lang) {
      setLanguage(lang);
      i18n.changeLanguage(lang);
    } else {
      setLanguage("ka");
    }
  }, []);
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>Admin | ITEQ Shop</title>
      </Helmet>

      <div className={styles.block}>
        <div className={styles.setBar}>
          <Link to="/" className={styles.logOut}>
            {t("admin_toMain")}
          </Link>
          <div className={styles.langBar}>
            <span onClick={() => changeLanguage("ka")}>geo</span>
            <span></span>
            <span onClick={() => changeLanguage("en")}>eng</span>
            <span></span>
            <span onClick={() => changeLanguage("ru")}>rus</span>
          </div>
          <Link onClick={logout} className={styles.logOut}>
            {t("admin_logOut")}
          </Link>
        </div>
        <ul className={styles.list}>
          <li>
            <NavLink
              to="/admin/orders"
              className={({ isActive }) => {
                return isActive ? styles.active : "";
              }}
            >
              {t("admin_orders")}
              {orderCount > 0 && (
                <span
                  style={{
                    color: "green",
                    margin: "0 1rem",
                    fontFamily: "RobotMedium",
                  }}
                >
                  {orderCount}
                </span>
              )}
              {canceledOrderCount > 0 && (
                <span style={{ color: "red", fontFamily: "RobotMedium" }}>
                  {canceledOrderCount}
                </span>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/history"
              className={({ isActive }) => {
                return isActive ? styles.active : "";
              }}
            >
              {t("admin_orderHistory")}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/clients"
              className={({ isActive }) => {
                return isActive ? styles.active : "";
              }}
            >
              {t("admin_clients")}
            </NavLink>
          </li>
          <li>
            <hr></hr>
          </li>
          <li>
            <NavLink
              to="/admin/categories"
              className={({ isActive, isPending }) => {
                return isActive ? styles.active : "";
              }}
            >
              {t("admin_categories")}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/products"
              className={({ isActive, isPending }) => {
                return isActive ? styles.active : "";
              }}
            >
              {t("admin_products")}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/colors"
              className={({ isActive, isPending }) => {
                return isActive ? styles.active : "";
              }}
            >
              {t("admin_colors")}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/brands"
              className={({ isActive }) => {
                return isActive ? styles.active : "";
              }}
            >
              {t("admin_brands")}
            </NavLink>
          </li>
          <li>
            <hr></hr>
          </li>
          {/* <li>
          <NavLink
            to="/admin/sliders"
            className={({ isActive }) => {
              return isActive ? styles.active : "";
            }}
          >
            Slider
          </NavLink>
        </li> */}
          {/* <li>
          <NavLink
            to="/admin/partners"
            className={({ isActive }) => {
              return isActive ? styles.active : "";
            }}
          >
            Partners
          </NavLink>
        </li> */}
          {/* <li>
          <NavLink
            to="/admin/portfolio"                 
            className={({ isActive }) => {
              return isActive ? styles.active : "";
            }}
          >
            Portfolio
          </NavLink>
        </li> */}
          <li>
            <NavLink
              to="/admin/aboutus"
              className={({ isActive }) => {
                return isActive ? styles.active : "";
              }}
            >
              {t("admin_aboutUs")}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/news"
              className={({ isActive }) => {
                return isActive ? styles.active : "";
              }}
            >
              {t("admin_news")}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/questions"
              className={({ isActive }) => {
                return isActive ? styles.active : "";
              }}
            >
              {t("admin_questions")}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/settings"
              className={({ isActive }) => {
                return isActive ? styles.active : "";
              }}
            >
              {t("admin_settings")}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/analytics"
              className={({ isActive }) => {
                return isActive ? styles.active : "";
              }}
            >
              {t("admin_analytics")}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/chat"
              className={({ isActive }) => {
                return isActive ? styles.active : "";
              }}
            >
              <div style={{ display: "flex" }}>
                {t("admin_chat")}
                {hasGlobalUnread && <span className={styles.unreadDot}></span>}
              </div>
            </NavLink>
          </li>
        </ul>
        <LanguageContext.Provider value={language}>
          <Outlet lang={language} />
        </LanguageContext.Provider>
      </div>
    </>
  );
};

export default Admin;
