import styles from "./Main.module.css";
import ProductMenu from "../productMenu/ProductMenu";
import CategoryMenu from "../categoryMenu/CategoryMenu";
import { categoryAPI, visitsAPI } from "../dalUser/userApi";

import { useEffect, useState } from "react";
import BrandMenu from "../brands/BrandMenu";
import { useTranslation } from "react-i18next";
import LoadingScreen from "../loadingScreen/LoadingScreen";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { MainPageSeoData } from "../seotags/MainPageSEO";

const Main = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const [mainCategories, setMainCategories] = useState([]);
  const [discountProducts, setDiscountProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seoData, setSeoData] = useState(null);

  useEffect(() => {
    LoadMainCategories();
    LoadDiscounts();
    LoadBrands();
  }, []);

  const LoadMainCategories = () => {
    categoryAPI
      .getMainCategories()
      .then((response) => {
        setMainCategories(response.data.categories);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {});
  };

  const LoadDiscounts = () => {
    categoryAPI
      .getDiscountsAll()
      .then((response) => {
        const products = response.data.products;
        setDiscountProducts(response.data.products);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {});
  };

  const LoadBrands = () => {
    categoryAPI
      .getBrands()
      .then((response) => {
        setBrands(response.data.brands);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (lang) setSeoData(MainPageSeoData[lang]);
  }, [lang]);

  // useEffect(() => {
  //   console.log(location.pathname);

  //   visitsAPI
  //     .addVisit({
  //       page_url: window.location.href,
  //       referrer: document.referrer,
  //     })
  //     .then((response) => {})
  //     .catch((error) => console.log(error))
  //     .finally(() => {});
  // }, [location.pathname]);

  return (
    <>
      {seoData && (
        <Helmet key={lang}>
          <title>{seoData.title}</title>
          <meta name="description" content={seoData.description} />
          <meta property="og:title" content={seoData.title} />
          <meta property="og:description" content={seoData.description} />
          <meta property="og:image" content={seoData.image} />
          <meta property="og:url" content={seoData.url} />
          <meta property="og:type" content="website" />
          <meta property="og:locale" content={seoData.ogLocale} />
          <meta property="og:locale:alternate" content="en_GB" />
          <meta property="og:locale:alternate" content="ru_RU" />
          <meta property="og:locale:alternate" content="ka_GE" />

          <link rel="alternate" href="https://iteq.shop/en/" hrefLang="en" />
          <link rel="alternate" href="https://iteq.shop/ru/" hrefLang="ru" />
          <link rel="alternate" href="https://iteq.shop/ka/" hrefLang="ka" />
          <link
            rel="alternate"
            href="https://iteq.shop/"
            hrefLang="x-default"
          />

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(seoData.jsonld),
            }}
          />
        </Helmet>
      )}

      <div style={{ position: "relative" }}>
        {loading && <LoadingScreen showGif={true} />}
        <h1>Safes, Smart Locks, Door Handles in Tbilisi</h1>
        {discountProducts.length > 0 && (
          <ProductMenu title={t("discount")} products={discountProducts} />
        )}

        <CategoryMenu id="cat" categories={mainCategories} />
        <BrandMenu brands={brands} />
      </div>
    </>
  );
};

export default Main;
