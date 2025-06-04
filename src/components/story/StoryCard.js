import { Link } from "react-router-dom";
import styles from "./Story.module.css";
import { LanguageContext } from "../../contexts/LanguageContext";
import { useContext } from "react";

const StoryCard = ({ story }) => {
  const lang = useContext(LanguageContext);
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <h3 className={styles.title}>
          {lang === "en" && story.titleEn}
          {lang === "ge" && story.titleGe}
          {lang === "ru" && story.titleRu}
        </h3>
        {lang === "en" && (
          <div
            className={styles.info}
            dangerouslySetInnerHTML={{ __html: story.contentEn }}
          />
        )}
        {lang === "ge" && (
          <div
            className={styles.info}
            dangerouslySetInnerHTML={{ __html: story.contentGe }}
          />
        )}
        {lang === "ru" && (
          <div
            className={styles.info}
            dangerouslySetInnerHTML={{ __html: story.contentRu }}
          />
        )}

        <Link to={`/news/${story.id}`} className={styles.link}>
          more...
        </Link>
      </div>
      <div>
        <img src={story.imgUrl} className={styles.img} />
      </div>
    </div>
  );
};

export default StoryCard;
