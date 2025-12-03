import styles from "./Category.module.css";
import closeIcon from "../../assets/close.svg";
import searchIcon from "../../assets/iconSearch.svg";
import { useEffect, useState } from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import ProductCard from "../productMenu/productCard/ProductCard";
import Paging from "../paging/Paging";
import LoadingScreen from "../loadingScreen/LoadingScreen";
import { useTranslation } from "react-i18next";
import useScreenSize from "../tools/ScreenSize";
import { CategorySeoData } from "../seotags/CategorySEO";
import { Helmet } from "react-helmet-async";

const Category = ({
  loading,
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
  seoCategory,
}) => {
  const { screenWidth, screenHeight } = useScreenSize();
  const [filterMode, SetFilterMode] = useState(
    screenWidth > 1024 ? true : false
  );
  const [seoData, setSeoData] = useState(null);

  useEffect(() => {
    SetFilterMode(screenWidth > 1024 ? true : false);
  }, [screenWidth]);

  const { lang } = useParams();
  const { t } = useTranslation();
  useEffect(() => {
    if (lang) setSeoData(CategorySeoData[lang]);
  }, [lang]);
  return (
    <>
      {seoData && seoCategory && (
        <Helmet key={`${lang}-${seoCategory.id}`}>
          {/* Basic SEO */}
          {lang === "en" && <title>{seoData.title(seoCategory.nameEn)}</title>}
          {lang === "ka" && <title>{seoData.title(seoCategory.nameGe)}</title>}
          {lang === "ru" && <title>{seoData.title(seoCategory.nameRu)}</title>}

          <meta name="description" content={seoData.description(seoCategory)} />

          {/* Open Graph */}
          {lang === "en" && (
            <meta
              property="og:title"
              content={seoData.title(seoCategory.nameEn)}
            />
          )}
          {lang === "ka" && (
            <meta
              property="og:title"
              content={seoData.title(seoCategory.nameGe)}
            />
          )}
          {lang === "ru" && (
            <meta
              property="og:title"
              content={seoData.title(seoCategory.nameRu)}
            />
          )}

          <meta
            property="og:description"
            content={seoData.description(seoData.description(seoCategory))}
          />
          <meta property="og:type" content="website" />
          <meta
            property="og:url"
            content={`${seoData.baseUrl}${seoCategory.id}/0/-1/-1/1`}
          />
          <meta property="og:image" content={seoCategory.imgUrl} />
          <meta property="og:locale" content={seoData.ogLocale} />
          <meta property="og:locale:alternate" content="en_GB" />
          <meta property="og:locale:alternate" content="ru_RU" />
          <meta property="og:locale:alternate" content="ka_GE" />

          {/* hreflang */}
          <link
            rel="alternate"
            href={`https://iteq.shop/en/category/${seoCategory.id}/0/-1/-1/1`}
            hrefLang="en"
          />
          <link
            rel="alternate"
            href={`https://iteq.shop/ru/category/${seoCategory.id}/0/-1/-1/1`}
            hrefLang="ru"
          />
          <link
            rel="alternate"
            href={`https://iteq.shop/ka/category/${seoCategory.id}/0/-1/-1/1`}
            hrefLang="ka"
          />
          <link
            rel="alternate"
            href={`https://iteq.shop/category/${seoCategory.id}/0/-1/-1/1`}
            hrefLang="x-default"
          />

          {/* JSON-LD Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                name: `${
                  lang === "en"
                    ? seoCategory.nameEn
                    : lang === "ka"
                    ? seoCategory.nameGe
                    : seoCategory.nameRu
                } – Category at ITEQ`,
                description: seoData.description(seoCategory),
                url: `${seoData.baseUrl}${seoCategory.id}/0/-1/-1/1`,
                image: seoCategory.imgUrl,
                publisher: {
                  "@type": "Organization",
                  name: "ITEQ",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://iteq.shop/static/media/logo.23ac6e37f7a4d129fcc4.png",
                  },
                },
                mainEntity: {
                  "@type": "Category",
                  name:
                    lang === "en"
                      ? seoCategory.nameEn
                      : lang === "ka"
                      ? seoCategory.nameGe
                      : seoCategory.nameRu,
                  url: `${seoData.baseUrl}${seoCategory.id}/0/-1/-1/1`,
                  image: seoCategory.imgUrl,
                  itemListElement: productList.map((p, i) => ({
                    "@type": "ListItem",
                    position: i + 1,
                    url: `https://iteq.shop/product/${p.id}`,
                  })),
                },
              }),
            }}
          />
        </Helmet>
      )}
      <div className={styles.block}>
        {loading && <LoadingScreen showGif={true} />}
        {
          <button
            className={`${styles.btn} ${styles.hoverUnderlineAnimation} ${styles.left}`}
            onClick={() => SetFilterMode(true)}
          >
            {t("filters")}
          </button>
        }
        <div
          style={{ width: "fit-content" }}
          className={`${
            filterMode
              ? "animate__animated animate__slideInLeft animate__faster"
              : "animate__animated animate__slideOutLeft animate__faster"
          } ${styles.filter}`}
        >
          <img
            src={closeIcon}
            className={styles.btnClose}
            onClick={() => SetFilterMode(false)}
          />
          <Menu
            items={categoryList}
            lang={lang}
            minPrice={minPrice}
            maxPrice={maxPrice}
            screenWidth={screenWidth}
            SetFilterMode={SetFilterMode}
          />

          <span className={styles.partTitle}>{t("Brands")}</span>
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
                <h2>{b.brandName}</h2>
              </li>
            ))}
          </ul>

          <span className={styles.partTitle}>{t("Pricerange")}</span>
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
              <img
                src={searchIcon}
                onClick={() => {
                  SetFilterMode(screenWidth > 1024 ? true : false);
                  search();
                }}
              />
            </span>
          </div>
        </div>
        <div>
          {seoCategory && (
            <h1>
              {lang === "en"
                ? seoCategory.nameEn
                : lang === "ka"
                ? seoCategory.nameGe
                : seoCategory.nameRu}
            </h1>
          )}

          <div className={styles.content}>
            {productList.map((p) => (
              <NavLink
                key={`nl${p.id}`}
                to={`/${lang}/product/${p.id}`}
                target="_blank"
                style={{ margin: "2rem" }}
              >
                <ProductCard key={p.id} product={p} />
              </NavLink>
            ))}
          </div>
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
    </>
  );
};

export default Category;

function Menu({ items, lang, minPrice, maxPrice, SetFilterMode, screenWidth }) {
  const [displayChildren, setDisplayChildren] = useState({});
  return (
    <ul className={`${styles.list} ${styles.listLeft}`}>
      {items.map((item) => {
        let titleValue = "";
        if (lang === "en") titleValue = item.titleEn;
        else if (lang === "ka") titleValue = item.titleGe;
        else titleValue = item.titleRu;
        return (
          <li key={item.id}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span
                className={`${styles.title} ${styles.hoverUnderlineAnimation} ${styles.left}`}
              >
                <h2>
                  <Link
                    className={styles.linkTitle}
                    to={`/${lang}/category/${
                      item.id
                    }/${0}/${minPrice}/${maxPrice}/${1}`}
                    onClick={() =>
                      SetFilterMode(screenWidth > 1024 ? true : false)
                    }
                  >
                    {titleValue}
                  </Link>
                </h2>
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
                screenWidth={screenWidth}
                SetFilterMode={SetFilterMode}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}
