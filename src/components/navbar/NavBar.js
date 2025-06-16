import styles from "./NavBar.module.css";
import menuIcon from "../../assets/menuIcon.svg";
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { categoryAPI } from "../dalUser/userApi";
import LoadingScreen from "../loadingScreen/LoadingScreen";
import { LanguageContext } from "../../contexts/LanguageContext";

const Navbar = () => {
  const [menuState, setMenuState] = useState(false);
  const [productMenuState, setProductMenuState] = useState(false);
  const { t, i18n } = useTranslation();
  const lang = useContext(LanguageContext);
  const [categoryList, setCategoryist] = useState([]);
  const [loading, setLoading] = useState(true);
  const refMenu = useRef(null);

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick, true);
  }, []);

  const handleOutsideClick = (e) => {
    if (refMenu.current) {
      if (!refMenu.current.contains(e.target)) {
        hide();
      }
    }
  };

  const hide = () => {
    setProductMenuState(false);
  };

  const LoadCategories = () => {
    categoryAPI
      .getCategories()
      .then((response) => {
        let result = [];
        for (let i = 0; i < response.data.categories.length; i++) {
          result.push({
            id: response.data.categories[i].id,
            titleEn: response.data.categories[i].nameEn,
            titleGe: response.data.categories[i].nameGe,
            titleRu: response.data.categories[i].nameRu,
            parentId: response.data.categories[i].parentId,
            collapsed: false,
            children: [],
          });
        }

        result.sort(function (a, b) {
          return a.parentId - b.parentId;
        });
        for (let i = result.length - 1; i > 0; i--) {
          if (result[i].parentId > 0) {
            result
              .find((c) => c.id === result[i].parentId)
              .children.unshift(result[i]);
          }
        }
        result = result.filter((c) => c.parentId === 0);
        setCategoryist(result);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const changeMenuState = () => {
    setMenuState((ms) => !ms);
  };

  useEffect(() => {
    LoadCategories();
  }, []);

  return (
    <div className={styles.block}>
      {loading && <LoadingScreen showGif={false} />}
      <img
        src={menuIcon}
        className={styles.menuIcon}
        onClick={changeMenuState}
      />
      <ul className={`${styles.list} ${!menuState && styles.collapse}`}>
        <li key="discounts" className={styles.listItem}>
          <Link to="/discounts">{t("discount")}</Link>
        </li>
        <li
          key="products"
          className={styles.listItem}
          style={{
            position: "relative",
            display: "inline-block",
            zIndex: 99999,
          }}
        >
          <Link to="#" onClick={() => setProductMenuState((p) => !p)}>
            {t("products")}
          </Link>
          <div
            ref={refMenu}
            className={`${styles.dropDownListContainer} ${
              !productMenuState && styles.collapse
            }`}
          >
            <Menu
              items={categoryList}
              isChildNode={false}
              hide={hide}
              lang={lang}
            />
          </div>
        </li>
        <li key="aboutus" className={styles.listItem}>
          <Link to="/about">{t("aboutUs")}</Link>
        </li>
        <li key="contacts" className={styles.listItem}>
          <Link to="/contacts">{t("contacts")}</Link>
        </li>
        <li key="news" className={styles.listItem}>
          <Link to="/news">{t("news")}</Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;

function Menu({ items, hide, isChildNode, lang }) {
  const [displayChildren, setDisplayChildren] = useState({});
  return (
    <div>
      <ul
        className={`${styles.dropDownList} ${
          isChildNode && styles.dropDownListExtra
        }`}
      >
        {items.map((item) => {
          return (
            <li key={item.id}>
              <div className={styles.itemContainer}>
                <span
                  className={styles.title}
                  onClick={() => {
                    hide();
                  }}
                >
                  <div
                    className={`${styles.hoverUnderlineAnimation} ${styles.left}`}
                  >
                    <Link to={`/category/${item.id}`}>
                      {lang === "en" && item.titleEn}
                      {lang === "ge" && item.titleGe}
                      {lang === "ru" && item.titleRu}
                    </Link>
                  </div>
                </span>{" "}
                <div>
                  {item.children.length > 0 && (
                    <button
                      className={styles.collapseBtn}
                      onClick={() => {
                        setDisplayChildren({
                          ...displayChildren,
                          [item.titleEn]: !displayChildren[item.titleEn],
                        });
                        item.collapsed = !item.collapsed;
                      }}
                    >
                      {displayChildren[item.titleEn] ? (
                        <img src={menuIcon} className={styles.opened} />
                      ) : (
                        <img src={menuIcon} className={styles.closed} />
                      )}
                    </button>
                  )}
                </div>
              </div>
              {/* <div
                className={`${styles.childrenList} ${!item.collapsed && styles.collapse }`}
              > */}
              {displayChildren[item.titleEn] && item.children && (
                <Menu
                  items={item.children}
                  isChildNode={true}
                  hide={hide}
                  lang={lang}
                />
              )}
              {/* </div> */}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
