import logo from "../../assets/logo.png";
import search from "../../assets/iconSearch.svg";
import cart from "../../assets/cart.svg";
import styles from "./Header.module.css";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { categoryAPI } from "../dalUser/userApi";
import Cookies from "universal-cookie";
import LoginContainer from "../login/LoginContainer";

const Header = ({
  changeLanguage,
  isAuth,
  userRole,
  userData,
  logout,
  basketItemsCount,
}) => {
  const { t, i18n } = useTranslation();
  const cookies = new Cookies();
  const navigate = useNavigate();

  const [accountState, setAccountState] = useState(false);
  const [loginState, setLoginState] = useState(false);

  const [searchItem, setSearchItem] = useState("");
  const [searchType, setSearchType] = useState("brand");
  const [searchData, setSearchData] = useState([]);
  const refMenu = useRef();
  const refLogin = useRef();

  useEffect(() => {
    document.addEventListener("click", outsideClickHandle, true);
  }, []);

  const outsideClickHandle = (e) => {
    if (refMenu.current)
      if (!refMenu.current.contains(e.target)) setAccountState(false);
    if (refLogin.current)
      if (!refLogin.current.contains(e.target)) setLoginState(false);
  };

  const searchTextChange = (searchText) => {
    const searchItems = searchText.split(" ");
    console.log(searchItems);

    setSearchItem(searchText);
    if (searchText) {
      categoryAPI
        .searchProducts(searchText)
        .then((response) => {
          console.log(response);
          setSearchData(response.data.searchData);
        })
        .catch((error) => console.log(error))
        .finally(() => {});
    } else {
      setSearchData([]);
    }
    // if (searchType === "brand") {
    //   categoryAPI.searchByBrand(searchText).then((response) => {
    //     setSearchData(response.data.map((bd) => ({ text: bd.brandName })));
    //   });
    // } else if (searchType === "model") {
    //   categoryAPI.searchByModel(searchText).then((response) => {
    //     setSearchData(response.data.map((md) => ({ text: md.nameEn })));
    //   });
    // } else {
    //   categoryAPI.searchByCategory(searchText).then((response) => {
    //     const dataArray = [];
    //     const lang = cookies.get("langIteq");

    //     response.data.forEach((cd) => {
    //       if (cd.nameEn.toLowerCase().includes(searchText.toLowerCase())) {
    //         dataArray.push({ text: cd.nameEn });
    //       } else if (cd.nameGe.includes(searchText)) {
    //         dataArray.push({ text: cd.nameGe });
    //       } else if (cd.nameRu.includes(searchText)) {
    //         dataArray.push({ text: cd.nameGe });
    //       }
    //       // if (lang === "en") {
    //       //   dataArray.push({ text: cd.nameEn });
    //       // } else if (lang === "ge") {
    //       //   dataArray.push({ text: cd.nameGe });
    //       // } else {
    //       //   dataArray.push({ text: cd.nameRu });
    //       // }
    //     });
    //     setSearchData(dataArray);
    //   });
    // }
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
                {sd.name}
              </li>
            ))}
          </ul>
        )}
        {/* <div className={styles.selectGroup}>
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
        </div> */}
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
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <Link to="/account" style={{ textWrap: "nowrap" }}>
                        {t("accountPage")}
                      </Link>
                    </div>
                  )}
                  <Link onClick={logout} style={{ textWrap: "nowrap" }}>
                    {t("signOut")}
                  </Link>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.loginMenu}>
            <button
              className={styles.btn}
              onClick={() => {
                //return navigate(`/login`);
                setLoginState((state) => !state);
              }}
            >
              {t("signIn")}
            </button>
            <div
              ref={refLogin}
              // onClick={() => setAccountState((state) => !state)}
            >
              {loginState && (
                <div className={styles.loginPanel}>
                  <LoginContainer close={() => setLoginState(false)} />
                </div>
              )}
            </div>
          </div>
        )}

        <div
          className={styles.cart}
          onClick={() => {
            return navigate(`/account/3?item=${Date.now()}`);
          }}
        >
          <img src={cart} />
          <span className={styles.cartCount}>{basketItemsCount}</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
