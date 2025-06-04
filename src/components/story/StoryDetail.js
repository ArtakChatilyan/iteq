import { useContext, useEffect, useState } from "react";
import styles from "./Story.module.css";
import { categoryAPI } from "../dalUser/userApi";
import { useParams } from "react-router-dom";
import { LanguageContext } from "../../contexts/LanguageContext";
import LoadingScreen from "../loadingScreen/LoadingScreen";

const StoryDetail = () => {
  const lang = useContext(LanguageContext);
  const [storyId] = useState(useParams().newsId);
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    LoadStory(storyId);
  }, []);

  const LoadStory = (storyId) => {
    categoryAPI
      .getStory(storyId)
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
    return <LoadingScreen showGif={true}/>;
  }
  return (
    <div className={styles.detailBlock}>
      <img src={story.imgUrl} />

      <h3 className={styles.detailTitle}>
        {lang === "en" && story.titleEn}
        {lang === "ge" && story.titleGe}
        {lang === "ru" && story.titleRu}
      </h3>

      {lang === "en" && (
        <div
          className={styles.detailInfo}
          dangerouslySetInnerHTML={{ __html: story.contentEn }}
        />
      )}
      {lang === "ge" && (
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
  );
};

export default StoryDetail;
