import logo from "../../assets/logo.png";
import search from "../../assets/iconSearch.svg";
import cart from "../../assets/cart.svg";
import styles from "./Header.module.css";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { categoryAPI } from "../dalUser/userApi";
import Cookies from "universal-cookie";

const Header = ({ changeLanguage, isAuth, userRole, userData, logout }) => {
  const { t, i18n } = useTranslation();
  const cookies = new Cookies();
  const navigate = useNavigate();

  const [accountState, setAccountState] = useState(false);

  const [searchItem, setSearchItem] = useState("");
  const [searchType, setSearchType] = useState("brand");
  const [searchData, setSearchData] = useState([]);
  const refMenu = useRef();

  useEffect(() => {
    document.addEventListener("click", outsideClickHandle, true);
  }, []);

  const outsideClickHandle = (e) => {
    if (refMenu.current)
      if (!refMenu.current.contains(e.target)) setAccountState(false);
  };

  const searchTextChange = (searchText) => {
    setSearchItem(searchText);
    if (searchText) {
      if (searchType === "brand") {
        categoryAPI.searchByBrand(searchText).then((response) => {
          setSearchData(response.data.map((bd) => ({ text: bd.brandName })));
        });
      } else if (searchType === "model") {
        categoryAPI.searchByModel(searchText).then((response) => {
          setSearchData(response.data.map((md) => ({ text: md.nameEn })));
        });
      } else {
        categoryAPI.searchByCategory(searchText).then((response) => {
          const dataArray = [];
          const lang = cookies.get("langIteq");

          response.data.forEach((cd) => {
            if (cd.nameEn.toLowerCase().includes(searchText.toLowerCase())) {
              dataArray.push({ text: cd.nameEn });
            } else if (cd.nameGe.includes(searchText)) {
              dataArray.push({ text: cd.nameGe });
            } else if (cd.nameRu.includes(searchText)) {
              dataArray.push({ text: cd.nameGe });
            }
            // if (lang === "en") {
            //   dataArray.push({ text: cd.nameEn });
            // } else if (lang === "ge") {
            //   dataArray.push({ text: cd.nameGe });
            // } else {
            //   dataArray.push({ text: cd.nameRu });
            // }
          });
          setSearchData(dataArray);
        });
      }
    } else {
      setSearchData([]);
    }
  };

  const searchHandle = () => {
    return navigate(`/search/${searchItem}/${searchType}`);
  };

  return (
    <div className={styles.header}>
      <Link to="/">
        <img src={logo} className={styles.logo} />
      </Link>
      <div className={styles.searchGroup}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder={t("search")}
            className={styles.input}
            value={searchItem}
            onChange={(e) => searchTextChange(e.currentTarget.value)}
          />
          <span className={styles.icon}>
            <img src={search} onClick={searchHandle} />
          </span>
        </div>
        {searchData.length > 0 && (
          <ul className={styles.autofill}>
            {searchData.map((sd) => (
              <li
                className={styles.afItem}
                onClick={(e) => {
                  setSearchItem(e.currentTarget.innerText);
                  setSearchData([]);
                }}
              >
                {sd.text}
              </li>
            ))}
          </ul>
        )}
        <div className={styles.selectGroup}>
          <input
            type="radio"
            value="brand"
            name="searchType"
            checked={searchType === "brand"}
            onChange={(e) => setSearchType(e.currentTarget.value)}
          />{" "}
          {t("byBrand")}
          <input
            type="radio"
            value="category"
            name="searchType"
            onChange={(e) => setSearchType(e.currentTarget.value)}
          />{" "}
          {t("byType")}
          <input
            type="radio"
            value="model"
            name="searchType"
            onChange={(e) => setSearchType(e.currentTarget.value)}
          />{" "}
          {t("byModel")}
        </div>
      </div>

      <div className={styles.personal}>
        <div className={styles.langBar}>
          <span onClick={() => changeLanguage("ge")}>geo</span>
          <span></span>
          <span onClick={() => changeLanguage("en")}>eng</span>
          <span></span>
          <span onClick={() => changeLanguage("ru")}>rus</span>
        </div>
        {isAuth ? (
          <div className={styles.account}>
            <div
              ref={refMenu}
              className={styles.accountName}
              onClick={() => setAccountState((state) => !state)}
            >
              {userData.name}
              {accountState && (
                <div className={styles.accountMenu}>
                  {userRole === "admin" ? (
                    <Link to="/admin" style={{ textWrap: "nowrap" }}>
                      {t("adminPanel")}
                    </Link>
                  ) : (
                    <Link to="/account" style={{ textWrap: "nowrap" }}>
                      {t("accountPage")}
                    </Link>
                  )}
                  <Link onClick={logout} style={{ textWrap: "nowrap" }}>
                    {t("signOut")}
                  </Link>
                </div>
              )}
            </div>
          </div>
        ) : (
          <button
            className={styles.btn}
            onClick={() => {
              return navigate(`/login`);
            }}
          >
            {t("signIn")}
          </button>
        )}

        <div className={styles.cart}>
          <img src={cart} />
          <span className={styles.cartCount}>0</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
