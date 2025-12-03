import { useEffect, useState } from "react";
import styles from "./Story.module.css";
import { categoryAPI } from "../dalUser/userApi";
import { useParams } from "react-router-dom";
import LoadingScreen from "../loadingScreen/LoadingScreen";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";

const StoryDetail = () => {
  const { newsId, lang } = useParams();

  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    LoadStory(newsId);
  }, []);

  const LoadStory = (newsId) => {
    categoryAPI
      .getStory(newsId)
      .then((response) => {
        setStory(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  if (loading) {
    return <LoadingScreen showGif={true} />;
  }

  return (
    <>
      {story && lang === "en" && (
        <Helmet key={lang}>
          <title>{story.titleEn}</title>
          <meta name="description" content={Object.assign(document.createElement('div'), { innerHTML: story.contentEn }).innerText} />

          {/* Open Graph */}
          <meta property="og:type" content="article" />
          <meta property="og:title" content={story.titleEn} />
          <meta property="og:description" content={Object.assign(document.createElement('div'), { innerHTML: story.contentEn }).innerText} />
          <meta
            property="og:url"
            content={`https://iteq.shop/${lang}/news/${story.id}`}
          />
          <meta property="og:image" content={story.imgUrl} />
          <meta property="og:locale" content={`${lang}_GB`} />

          {/* Hreflang (optional if multilingual news) */}
          <link
            rel="alternate"
            href={`${`https://iteq.shop/${lang}/news/${story.id}`}`}
            hrefLang={lang}
          />

          {/* JSON-LD */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "NewsArticle",
                headline: story.titleEn,
                description: Object.assign(document.createElement('div'), { innerHTML: story.contentEn }).innerText,
                image: story.imgUrl,
                author: {
                  "@type": "Organization",
                  name: "ITEQ",
                },
                publisher: {
                  "@type": "Organization",
                  name: "ITEQ",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://iteq.shop/static/media/logo.23ac6e37f7a4d129fcc4.png",
                  },
                },
                mainEntityOfPage: `https://iteq.shop/${lang}/news/${story.id}`,
              }),
            }}
          />
        </Helmet>
      )}
      {story && lang === "ru" && (
        <Helmet key={lang}>
          <title>{story.titleRu}</title>
          <meta name="description" content={Object.assign(document.createElement('div'), { innerHTML: story.contentRu }).innerText} />

          {/* Open Graph */}
          <meta property="og:type" content="article" />
          <meta property="og:title" content={story.titleRu} />
          <meta property="og:description" content={Object.assign(document.createElement('div'), { innerHTML: story.contentRu }).innerText} />
          <meta
            property="og:url"
            content={`https://iteq.shop/${lang}/news/${story.id}`}
          />
          <meta property="og:image" content={story.imgUrl} />
          <meta property="og:locale" content={`${lang}_RU`} />

          {/* Hreflang (optional if multilingual news) */}
          <link
            rel="alternate"
            href={`${`https://iteq.shop/${lang}/news/${story.id}`}`}
            hrefLang={lang}
          />

          {/* JSON-LD */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "NewsArticle",
                headline: story.titleRu,
                description: Object.assign(document.createElement('div'), { innerHTML: story.contentRu }).innerText,
                image: story.imgUrl,
                author: {
                  "@type": "Organization",
                  name: "ITEQ",
                },
                publisher: {
                  "@type": "Organization",
                  name: "ITEQ",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://iteq.shop/static/media/logo.23ac6e37f7a4d129fcc4.png",
                  },
                },
                mainEntityOfPage: `https://iteq.shop/${lang}/news/${story.id}`,
              }),
            }}
          />
        </Helmet>
      )}
      {story && lang === "ka" && (
        <Helmet key={lang}>
          <title>{story.titleGe}</title>
          <meta name="description" content={Object.assign(document.createElement('div'), { innerHTML: story.contentGe }).innerText} />

          {/* Open Graph */}
          <meta property="og:type" content="article" />
          <meta property="og:title" content={story.titleGe} />
          <meta property="og:description" content={Object.assign(document.createElement('div'), { innerHTML: story.contentGe }).innerText} />
          <meta
            property="og:url"
            content={`https://iteq.shop/${lang}/news/${story.id}`}
          />
          <meta property="og:image" content={story.imgUrl} />
          <meta property="og:locale" content={`${lang}_GE`} />

          {/* Hreflang (optional if multilingual news) */}
          <link
            rel="alternate"
            href={`${`https://iteq.shop/${lang}/news/${story.id}`}`}
            hrefLang={lang}
          />

          {/* JSON-LD */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "NewsArticle",
                headline: story.titleGe,
                description: Object.assign(document.createElement('div'), { innerHTML: story.contentGe }).innerText,
                image: story.imgUrl,
                author: {
                  "@type": "Organization",
                  name: "ITEQ",
                },
                publisher: {
                  "@type": "Organization",
                  name: "ITEQ",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://iteq.shop/static/media/logo.23ac6e37f7a4d129fcc4.png",
                  },
                },
                mainEntityOfPage: `https://iteq.shop/${lang}/news/${story.id}`,
              }),
            }}
          />
        </Helmet>
      )}

      <div className={styles.detailBlock}>
        <img src={story.imgUrl} />

        <h2 className={styles.detailTitle}>
          {lang === "en" && story.titleEn}
          {lang === "ka" && story.titleGe}
          {lang === "ru" && story.titleRu}
        </h2>

        {lang === "en" && (
          <div
            className={styles.detailInfo}
            dangerouslySetInnerHTML={{ __html: story.contentEn }}
          />
        )}
        {lang === "ka" && (
          <div
            className={styles.detailInfo}
            dangerouslySetInnerHTML={{ __html: story.contentGe }}
          />
        )}
        {lang === "ru" && (
          <div
            className={styles.detailInfo}
            dangerouslySetInnerHTML={{ __html: story.contentRu }}
          />
        )}
      </div>
    </>
  );
};

export default StoryDetail;
