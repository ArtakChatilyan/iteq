import logo from "../../assets/logo.png";
import search from "../../assets/iconSearch.svg";
import cart from "../../assets/cart.svg";
import styles from "./Header.module.css";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { categoryAPI } from "../dalUser/userApi";
import LoginContainer from "../login/LoginContainer";

const Header = ({
  changeLanguage,
  isAuth,
  userRole,
  userData,
  logout,
  basketItemsCount,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {lang}=useParams();

  const [accountState, setAccountState] = useState(false);
  const [loginState, setLoginState] = useState(false);

  const [searchItem, setSearchItem] = useState("");
  const [searchType, setSearchType] = useState("brand");
  const [searchData, setSearchData] = useState([]);
  const refMenu = useRef();
  const refLogin = useRef();
  const searchRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(-1);
  const [showHints, setShowHints] = useState(false);

  const searchKeyDown = (e) => {
    if (searchItem && (searchData.length === 0 || activeIndex < 0)) {
      if (e.key === "Enter") {
        searchHandle();
      }
    }
    if (!showHints || searchData.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % searchData.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev <= 0 ? searchData.length - 1 : prev - 1
        );
        break;
      case "Enter":
        if (activeIndex >= 0 && activeIndex < searchData.length) {
          handleSelect(searchData[activeIndex].name);
        }
        break;
      case "Escape":
        setShowHints(false);
        break;
      default:
        break;
    }
  };

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
    setSearchItem(searchText);
    if (searchText) {
      categoryAPI
        .searchProducts(searchText)
        .then((response) => {
          setSearchData(response.data.searchData);
          setShowHints(true);
        })
        .catch((error) => console.log(error))
        .finally(() => {});
    } else {
      setSearchData([]);
      setShowHints(false);
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
    //       // } else if (lang === "ka") {
    //       //   dataArray.push({ text: cd.nameGe });
    //       // } else {
    //       //   dataArray.push({ text: cd.nameRu });
    //       // }
    //     });
    //     setSearchData(dataArray);
    //   });
    // }
  };

  const handleSelect = (value) => {
    const parts = searchItem.trim().split(/\s+/);
    parts[parts.length - 1] = value;
    const newQuery = parts.join(" ") + " ";
    setSearchItem(newQuery);
    setSearchData([]);
    searchRef.current.focus();
  };

  const highlightMatchJSX = (text) => {
    const lastTerm = searchItem.split(/\s+/).pop();
    const parts = text.split(new RegExp(`(${lastTerm})`, "ig"));
    return parts.map((part, i) =>
      part.toLowerCase() === lastTerm.toLowerCase() ? (
        <span style={{ color: "rgba(199, 110, 21, 1)" }} key={i}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const searchHandle = () => {
    return navigate(`/${lang}/search/${encodeURIComponent(searchItem)}`);
  };

  return (
    <div className={styles.header}>
      <Link to={`/${lang}`}>
        <img src={logo} className={styles.logo} />
      </Link>
      <div className={styles.searchGroup}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder={t("search")}
            className={styles.input}
            value={searchItem}
            onChange={(e) => {
              searchTextChange(e.currentTarget.value);
              setActiveIndex(-1);
            }}
            onKeyDown={searchKeyDown}
            ref={searchRef}
            onFocus={() => searchItem && setShowHints(true)}
            onBlur={() => setTimeout(() => setShowHints(false), 150)}
          />
          <span className={styles.icon}>
            <img src={search} onClick={searchHandle} />
          </span>
        </div>
        {showHints && searchData.length > 0 && (
          <ul className={styles.autofill}>
            {searchData.map((sd, i) => (
              <li key={`sd_${i}`}
                className={`${styles.afItem} ${
                  activeIndex === i ? styles.afItemSelected : ""
                }`}
                onClick={(e) => {
                  setSearchItem(e.currentTarget.innerText);
                  setSearchData([]);
                  searchRef.current.focus();
                }}
                onMouseDown={() => handleSelect(sd.name)}
              >
                {highlightMatchJSX(sd.name)}
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
          <span onClick={() => changeLanguage("ka")}>geo</span>
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
            return navigate("/account");
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
