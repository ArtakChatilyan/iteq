import { Link, useParams } from "react-router-dom";
import styles from "./Story.module.css";

const StoryCard = ({ story }) => {
  const {lang} = useParams();
  
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <h3 className={styles.title}>
          {lang === "en" && story.titleEn}
          {lang === "ka" && story.titleGe}
          {lang === "ru" && story.titleRu}
        </h3>
        {lang === "en" && (
          <div
            className={styles.info}
            dangerouslySetInnerHTML={{ __html: story.contentEn }}
          />
        )}
        {lang === "ka" && (
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

        <Link to={`/${lang}/news/${story.id}`} className={styles.link}>
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
