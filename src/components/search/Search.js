import { NavLink, useLocation, useParams } from "react-router-dom";
import styles from "./Search.module.css";
import Paging from "../paging/Paging";
import { useEffect, useState } from "react";
import ProductCard from "../productMenu/productCard/ProductCard";
import { categoryAPI } from "../dalUser/userApi";
import { Helmet } from "react-helmet-async";
import { SearchSeoData } from "../seotags/SearchSEO";

const Search = () => {
  const { searchItem, lang } = useParams();
  let location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(9);
  const [total, setTotal] = useState(0);

  const [productList, setProductList] = useState([]);
  const [seoData, setSeoData] = useState(null);

  const pagingHandler = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    if (searchItem) SearchProducts(searchItem, currentPage, perPage);
  }, [currentPage, location]);

  const SearchProducts = (term, page, perPage) => {
    categoryAPI
      .searchProductsByGeneral(term, page, perPage)
      .then((response) => {
        setTotal(response.data.total);
        setProductList(response.data.products);
      });
  };
  useEffect(() => {
    if (lang) setSeoData(SearchSeoData[lang]);
  }, [lang]);

  return (
    <>
      {seoData && (
        <Helmet key={`${lang}-${decodeURIComponent(searchItem || "")}`}>
          {/* Dynamic Title & Description */}
          <title>{seoData.title(searchItem)}</title>
          <meta name="description" content={seoData.description(decodeURIComponent(searchItem || ""))} />

          {/* Open Graph */}
          <meta property="og:title" content={seoData.title(decodeURIComponent(searchItem || ""))} />
          <meta property="og:description" content={seoData.description(decodeURIComponent(searchItem || ""))} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={`${seoData.baseUrl}${encodeURIComponent(decodeURIComponent(searchItem || ""))}`} />
          <meta
            property="og:image"
            content="https://iteq.shop/static/media/logo.23ac6e37f7a4d129fcc4.png"
          />
          <meta property="og:locale" content={seoData.ogLocale} />
          <meta property="og:locale:alternate" content="en_GB" />
          <meta property="og:locale:alternate" content="ru_RU" />
          <meta property="og:locale:alternate" content="ka_GE" />

          {/* hreflang links */}
          <link
            rel="alternate"
            href={`https://iteq.shop/en/search/${encodeURIComponent(decodeURIComponent(searchItem || ""))}`}
            hrefLang="en"
          />
          <link
            rel="alternate"
            href={`https://iteq.shop/ru/search/${encodeURIComponent(decodeURIComponent(searchItem || ""))}`}
            hrefLang="ru"
          />
          <link
            rel="alternate"
            href={`https://iteq.shop/ka/search/${encodeURIComponent(decodeURIComponent(searchItem || ""))}`}
            hrefLang="ka"
          />
          <link
            rel="alternate"
            href={`https://iteq.shop/search/${encodeURIComponent(decodeURIComponent(searchItem || ""))}`}
            hrefLang="x-default"
          />

          {/* JSON-LD (structured data for search results) */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "SearchResultsPage",
                name: `Search results for "${decodeURIComponent(searchItem || "")}"`,
                description: seoData.description(decodeURIComponent(searchItem || "")),
                url: `${seoData.baseUrl}${encodeURIComponent(decodeURIComponent(searchItem || ""))}`,
                potentialAction: {
                  "@type": "SearchAction",
                  target: `${seoData.baseUrl}{search_term_string}`,
                  "query-input": "required name=search_term_string",
                },
                publisher: {
                  "@type": "Organization",
                  name: "ITEQ",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://iteq.shop/static/media/logo.23ac6e37f7a4d129fcc4.png",
                  },
                },
              }),
            }}
          />
        </Helmet>
      )}
      <div className={styles.block}>
        <div className={styles.searchInfo}>
          search result for '{searchItem}'
        </div>
        <div className={styles.content}>
          {productList.map((p) => (
            <NavLink to={`/${lang}/product/${p.id}`} target="blank">
              <ProductCard key={p.id} product={p} />
            </NavLink>
          ))}
        </div>
        {total > 0 && (
          <div>
            <Paging
              mode="user"
              totalCount={total}
              currentPage={currentPage}
              pageSize={perPage}
              paging={pagingHandler}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Search;
