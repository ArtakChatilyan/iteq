import styles from "./Category.module.css";
import closeIcon from "../../assets/close.svg";
import searchIcon from "../../assets/iconSearch.svg";
import { LanguageContext } from "../../contexts/LanguageContext";
import { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import ProductCard from "../productMenu/productCard/ProductCard";
import Paging from "../paging/Paging";
import LoadingScreen from "../loadingScreen/LoadingScreen";

const Category = ({
  loading,
  filterMode,
  setFilterMode,
  categoryList,
  brandList,
  selectedBrands,
  SelectBrands,
  productList,
  currentPage,
  perPage,
  total,
  setNewPage,
  dbMinPrice,
  dbMaxPrice,
  minPrice,
  maxPrice,
  chnageMinPrice,
  chnageMaxPrice,
  search,
}) => {
  const lang = useContext(LanguageContext);
  return (
    <div className={styles.block}>
      {loading && <LoadingScreen showGif={true} />}
      {
        <button
          className={`${styles.btn} ${styles.hoverUnderlineAnimation} ${styles.left}`}
          onClick={() => setFilterMode(true)}
        >
          Filters
        </button>
      }
      <div
        className={`${
          filterMode
            ? "animate__animated animate__slideInLeft animate__faster"
            : "animate__animated animate__slideOutLeft animate__faster"
        } ${styles.filter}`}
      >
        <img
          src={closeIcon}
          className={styles.btnClose}
          onClick={() => setFilterMode(false)}
        />
        <Menu
          items={categoryList}
          lang={lang}
          minPrice={minPrice}
          maxPrice={maxPrice}
        />

        <span className={styles.partTitle}>Brands</span>
        <ul className={styles.list}>
          {brandList.map((b) => (
            <li key={`chk${b.brandId}`}>
              <input
                type="checkbox"
                checked={selectedBrands.includes(b.brandId)}
                style={{
                  width: "16px",
                  height: "16px",
                  cursor: "pointer",
                  marginRight: "8px",
                  backgroundColor: "red",
                }}
                onChange={(e) => SelectBrands(e, b.brandId)}
              />
              {b.brandName}
            </li>
          ))}
        </ul>

        <span className={styles.partTitle}>Price range</span>
        <div style={{ marginTop: "6px" }}>
          <table>
            <tbody>
              <tr>
                <td className={styles.label}>
                  <span>{dbMinPrice}</span>
                </td>
                <td className={styles.label}>
                  <span>-</span>
                </td>
                <td className={styles.label}>
                  <span>
                    <span className={styles.label}>{dbMaxPrice}</span>
                    <span className={styles.label}>&#8382; </span>
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <input
                    type="text"
                    value={minPrice}
                    className={styles.input}
                    onChange={(e) => chnageMinPrice(e.target.value)}
                  />
                </td>
                <td>
                  <span className={styles.label}>-</span>
                </td>
                <td>
                  <input
                    type="text"
                    value={maxPrice}
                    className={styles.input}
                    onChange={(e) => chnageMaxPrice(e.target.value)}
                  />
                </td>
                {/* <td>
                  <span className={styles.icon}>
                    <img src={searchIcon} onClick={FilterByPrice} />
                  </span>
                </td> */}
              </tr>
            </tbody>
          </table>
          <span className={styles.icon}>
            <img src={searchIcon} onClick={search} />
          </span>
        </div>
      </div>
      <div className={styles.content}>
        {productList.map((p) => (
          <NavLink to={`/product/${p.id}`} target="blank">
            <ProductCard key={p.id} product={p} />
          </NavLink>
        ))}
      </div>

      <div className={styles.paging}>
        <Paging
          mode="user"
          totalCount={total}
          currentPage={parseInt(currentPage)}
          pageSize={perPage}
          paging={setNewPage}
        />
      </div>
    </div>
  );
};

export default Category;

function Menu({ items, lang, minPrice, maxPrice }) {
  const [displayChildren, setDisplayChildren] = useState({});
  return (
    <ul className={`${styles.list} ${styles.listLeft}`}>
      {items.map((item) => {
        let titleValue = "";
        if (lang === "en") titleValue = item.titleEn;
        else if (lang === "ge") titleValue = item.titleGe;
        else titleValue = item.titleRu;
        return (
          <li key={item.id}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span
                className={`${styles.title} ${styles.hoverUnderlineAnimation} ${styles.left}`}
              >
                <Link
                  className={styles.linkTitle}
                  to={`/category/${
                    item.id
                  }/${0}/${minPrice}/${maxPrice}/${1}`}
                >
                  {titleValue}
                </Link>
              </span>{" "}
              {item.children.length > 0 && (
                <button
                  className={styles.arrow}
                  onClick={() => {
                    setDisplayChildren({
                      ...displayChildren,
                      [item.titleEn]: !displayChildren[item.titleEn],
                    });
                  }}
                >
                  {displayChildren[item.titleEn] ? (
                    <span className={styles.opened}>&gt;</span>
                  ) : (
                    <span className={styles.closed}>&gt;</span>
                  )}
                </button>
              )}
            </div>
            {displayChildren[item.titleEn] && item.children && (
              <Menu
                items={item.children}
                lang={lang}
                minPrice={minPrice}
                maxPrice={maxPrice}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}
