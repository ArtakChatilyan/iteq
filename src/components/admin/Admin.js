import { Link, Navigate, NavLink, Outlet } from "react-router-dom";
import Cookies from "universal-cookie";
import styles from "./Admin.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { checkAuth, logout, setLoading } from "../../redux-store/userSlice";
import SplashScreen from "./content/splashscreen/SplashScreen";
import i18n from "../../localization/i18n";
import { useTranslation } from "react-i18next";
import { orderApi } from "./dal/api";
import { LanguageContext } from "../../contexts/LanguageContext";
import { Helmet } from "react-helmet-async";

const AdminContainer = () => {
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.userReducer.userRole);
  const loading = useSelector((state) => state.userReducer.loading);

  useEffect(() => {
    if (localStorage.getItem("tokenIteq")) {
      dispatch(checkAuth());
    } else {
      dispatch(setLoading(false));
    }
  }, []);

  const logOutHandle = () => {
    dispatch(logout());
  };

  const [orderCount, setOrderCount] = useState(0);
  const [canceledOrderCount, setCanceledOrderCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        orderApi
          .getOrdersCount()
          .then((response) => {
            setOrderCount(response.data.total);
            setCanceledOrderCount(response.data.totalCanceled);
          })
          .catch((error) => console.log(error))
          .finally(() => {});
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const intervalId = setInterval(fetchData, 1000 * 60 * 3);

    return () => clearInterval(intervalId);
  }, []);

  if (loading) return <SplashScreen />;

  if (userRole === "admin")
    return (
      <Admin
        logout={logOutHandle}
        orderCount={orderCount}
        canceledOrderCount={canceledOrderCount}
      />
    );
  else return <Navigate to="/login" replace />;
};

const Admin = ({ logout, orderCount, canceledOrderCount }) => {
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
      setLanguage("ge");
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
            <span onClick={() => changeLanguage("ge")}>geo</span>
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
        </ul>
        <LanguageContext.Provider value={language}>
          <Outlet lang={language} />
        </LanguageContext.Provider>
      </div>
    </>
  );
};

export default AdminContainer;
