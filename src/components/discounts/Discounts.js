import { NavLink, useParams } from "react-router-dom";
import styles from "./Discounts.module.css";
import ProductCard from "../productMenu/productCard/ProductCard";
import Paging from "../paging/Paging";
import { useEffect, useState } from "react";
import { categoryAPI } from "../dalUser/userApi";
import LoadingScreen from "../loadingScreen/LoadingScreen";
import { Helmet } from "react-helmet-async";
import { DiscountPageSEO } from "../seotags/DiscountPageSEO";

const Discounts = () => {
  const { lang } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(9);
  const [total, setTotal] = useState(0);
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seoData, setSeoData] = useState(null);

  useEffect(() => {
    LoadDiscounts(currentPage, perPage);
  }, [currentPage]);

  const pagingHandler = (pageNumber) => {
    setCurrentPage(pageNumber);
    setLoading(true);
  };

  const LoadDiscounts = (page, count) => {
    categoryAPI
      .getDiscounts(page, count)
      .then((response) => {
        setTotal(response.data.total);
        setProductList(response.data.products);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (lang) setSeoData(DiscountPageSEO[lang]);
  }, [lang]);

  return (
    <>
      {seoData && (
        <Helmet key={lang}>
          {/* Base SEO */}
          <title>{seoData.title}</title>
          <meta name="description" content={seoData.description} />

          {/* Open Graph */}
          <meta property="og:title" content={seoData.title} />
          <meta property="og:description" content={seoData.description} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={seoData.url} />
          <meta
            property="og:image"
            content="https://iteq.shop/static/media/logo.23ac6e37f7a4d129fcc4.png"
          />
          <meta property="og:locale" content={seoData.ogLocale} />
          <meta property="og:locale:alternate" content="en_GB" />
          <meta property="og:locale:alternate" content="ru_RU" />
          <meta property="og:locale:alternate" content="ka_GE" />

          {/* Hreflang links */}
          <link
            rel="alternate"
            href="https://iteq.shop/en/discounts/"
            hrefLang="en"
          />
          <link
            rel="alternate"
            href="https://iteq.shop/ru/discounts/"
            hrefLang="ru"
          />
          <link
            rel="alternate"
            href="https://iteq.shop/ka/discounts/"
            hrefLang="ka"
          />
          <link
            rel="alternate"
            href="https://iteq.shop/discounts/"
            hrefLang="x-default"
          />

          {/* JSON-LD */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(seoData.jsonld) }}
          />
        </Helmet>
      )}
      <div className={styles.block}>
        {loading && <LoadingScreen showGif={true} />}
        <div className={styles.block}>
            <h1>Discounts on Electronics and Accessories</h1>
          <div className={styles.content}>
            {productList.map((p) => (
              <NavLink
                key={`nl${p.id}`}
                to={`/${lang}/product/${p.id}`}
                target="blank"
              >
                <ProductCard key={p.id} product={p} />
              </NavLink>
            ))}
          </div>
        </div>
        <div style={{ margin: "20px" }}>
          <Paging
            mode="user"
            totalCount={total}
            currentPage={currentPage}
            pageSize={perPage}
            paging={pagingHandler}
          />
        </div>
      </div>
    </>
  );
};

export default Discounts;
