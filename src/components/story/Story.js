import { useEffect, useState } from "react";
import { categoryAPI } from "../dalUser/userApi";
import styles from "./Story.module.css";
import Paging from "../paging/Paging";
import StoryCard from "./StoryCard";
import LoadingScreen from "../loadingScreen/LoadingScreen";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { NewsSeoData } from "../seotags/NewsSEO";
import { useParams } from "react-router-dom";

const Story = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(9);
  const [total, setTotal] = useState(0);
  const [storyList, setStoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const {lang}=useParams();
  const [seoData, setSeoData] = useState(null);

  useEffect(() => {
    LoadStories(currentPage, perPage);
  }, [currentPage]);

  const LoadStories = (page, count) => {
    setLoading(true);
    categoryAPI
      .getStories(page, count)
      .then((response) => {
        setStoryList(response.data.stories);
        setTotal(response.data.total);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const pagingHandler = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    if (lang) setSeoData(NewsSeoData[lang]);
  }, [lang]);

  return (
    <>
      {seoData && (
        <Helmet key={lang}>
          {/* Basic meta */}
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

          {/* Hreflangs */}
          <link
            rel="alternate"
            href="https://iteq.shop/en/new/"
            hrefLang="en"
          />
          <link
            rel="alternate"
            href="https://iteq.shop/ru/new/"
            hrefLang="ru"
          />
          <link
            rel="alternate"
            href="https://iteq.shop/ka/new/"
            hrefLang="ka"
          />
          <link
            rel="alternate"
            href="https://iteq.shop/new/"
            hrefLang="x-default"
          />

          {/* JSON-LD structured data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(seoData.jsonld) }}
          />
        </Helmet>
      )}
      <div className={styles.block}>
        <h1>ITEQ News & Updates</h1>
        {loading && <LoadingScreen showGif={true} />}
        {storyList.map((s) => (
          <StoryCard key={s.id} story={s} />
        ))}
        {total > 0 && (
          <Paging
            mode="user"
            totalCount={total}
            currentPage={currentPage}
            pageSize={perPage}
            paging={pagingHandler}
          />
        )}
      </div>
    </>
  );
};

export default Story;
