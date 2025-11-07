import { useContext } from "react";
import styles from "./Faqs.module.css";
import { LanguageContext } from "../../contexts/LanguageContext";
import { useParams } from "react-router-dom";

const FaqsCard = ({ faqs }) => {
  const {lang} = useParams();
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <h3 className={styles.title}>
          <span style={{margin:"0 .4rem"}}>&ldquo;</span>
          {lang === "en" && faqs.questionEn}
          {lang === "ka" && faqs.questionGe}
          {lang === "ru" && faqs.questionRu}
          <span style={{margin:"0 .4rem"}}>&rdquo;</span>
        </h3>
        <div className={styles.info}>
          {lang === "en" && faqs.answerEn}
          {lang === "ka" && faqs.answerGe}
          {lang === "ru" && faqs.answerRu}
        </div>
        {/* <Link to={`/news/${story.id}`} className={styles.link}>
          more...
        </Link> */}
      </div>
    </div>
  );
};

export default FaqsCard;
