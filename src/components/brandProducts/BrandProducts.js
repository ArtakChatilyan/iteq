import { NavLink, useParams } from "react-router-dom";
import styles from "./BrandProducts.module.css";
import ProductCard from "../productMenu/productCard/ProductCard";
import Paging from "../paging/Paging";
import { useEffect, useState } from "react";
import { categoryAPI } from "../dalUser/userApi";
import LoadingScreen from "../loadingScreen/LoadingScreen";
import { BrandSeoData } from "../seotags/BrandSEO";
import { Helmet } from "react-helmet-async";

const BrandProducts = () => {
  const { brandId, lang } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(9);
  const [total, setTotal] = useState(0);
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [brand, setBrand] = useState(null);
  const [seoData, setSeoData] = useState(null);

  useEffect(() => {
    if (brandId)
      categoryAPI
        .getBrandById(brandId)
        .then((response) => {
          setBrand(response.data.brand);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {});
  }, [brandId]);

  useEffect(() => {
    LoadProducts(brandId, currentPage, perPage);
  }, [currentPage]);

  const pagingHandler = (pageNumber) => {
    setCurrentPage(pageNumber);
    setLoading(true);
  };

  const LoadProducts = (brandId, page, count) => {
    categoryAPI
      .getBrandProducts(brandId, page, count)
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
    if (lang) setSeoData(BrandSeoData[lang]);
  }, [lang]);

  return (
    <>
      {seoData && brand && (
        <Helmet key={`${lang}-${brandId}`}>
          {/* Basic SEO */}
          <title>{seoData.title(brand.brandName)}</title>
          <meta name="description" content={seoData.description(brand.brandName)} />

          {/* Open Graph */}
          <meta property="og:title" content={seoData.title(brand.brandName)} />
          <meta property="og:description" content={seoData.description(brand.brandName)} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={`${seoData.baseUrl}${brandId}`} />
          <meta property="og:image" content={brand.imgUrl} />
          <meta property="og:locale" content={seoData.ogLocale} />
          <meta property="og:locale:alternate" content="en_GB" />
          <meta property="og:locale:alternate" content="ru_RU" />
          <meta property="og:locale:alternate" content="ka_GE" />

          {/* hreflang links */}
          <link
            rel="alternate"
            href={`https://iteq.shop/en/brands/${brandId}`}
            hrefLang="en"
          />
          <link
            rel="alternate"
            href={`https://iteq.shop/ru/brands/${brandId}`}
            hrefLang="ru"
          />
          <link
            rel="alternate"
            href={`https://iteq.shop/ka/brands/${brandId}`}
            hrefLang="ka"
          />
          <link
            rel="alternate"
            href={`https://iteq.shop/brands/${brandId}`}
            hrefLang="x-default"
          />

          {/* JSON-LD Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                name: `${brand.brandName} – Products at ITEQ`,
                description: seoData.description(brand.brandName),
                url: `${seoData.baseUrl}${brandId}`,
                image: brand.imgUrl,
                publisher: {
                  "@type": "Organization",
                  name: "ITEQ",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://iteq.shop/static/media/logo.23ac6e37f7a4d129fcc4.png",
                  },
                },
                mainEntity: {
                  "@type": "Brand",
                  name: brand.brandName,
                  logo: brand.imgUrl,
                  url: `${seoData.baseUrl}${brandId}`
                },
              }),
            }}
          />
        </Helmet>
      )}
      {/* <Helmet>
        {brand && <title>{brand.brandName} | ITEQ Shop</title>}
        {brand && (
          <meta
            property="og:title"
            content={`${brand.brandName} | ITEQ Shop`}
          />
        )}
        {brand && <meta name="description" content={brand.brandName} />}
        {brand && <meta name="og:description" content={brand.brandName} />}
        {brand && brand.imgUrl && (
          <meta property="og:image" content={brand.imgUrl} />
        )}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Brand",
            name: brand ? brand.brandName : "",
            logo: brand && brand.imgUrl,
            url: brand && `https://iteq.shop//brands/${brand.id}`,
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name:brand && `${brand.brandName} Products`,
              itemListElement: productList.map((p, i) => ({
                "@type": "Product",
                position: i + 1,
                url: `https://iteq.shop/product/${p.id}`,
                name: p.productNameEn,
              })),
            },
          })}
        </script>
      </Helmet> */}
      <div className={styles.block}>
        {loading && <LoadingScreen showGif={true} />}
        {brand && <img src={brand.imgUrl} className={styles.logo} />}
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

export default BrandProducts;
