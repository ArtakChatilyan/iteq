import styles from "./Footer.module.css";
import map from "../../assets/map.png";
import fb from "../../assets/icons8-facebook.svg";
import inst from "../../assets/icons8-instagram.svg";
import twit from "../../assets/icons8-twitter-bird.svg";
import Subscriber from "../subscribtion/Subscribtion";
import { useEffect, useState } from "react";
import { categoryAPI } from "../dalUser/userApi";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Cookies from "universal-cookie";
import LoadingScreen from "../loadingScreen/LoadingScreen";

const Footer = ({ lang }) => {
  const { t, i18n } = useTranslation();
  const cookies = new Cookies();
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    LoadCategories();
  }, []);

  const LoadCategories = () => {
    categoryAPI
      .getMainCategories()
      .then((response) => {
        setCategoryList(response.data.categories);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div className={styles.block}>
      {loading && <LoadingScreen showGif={false} />}
      {/* <Subscriber /> */}
      <div className={styles.mapContent}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2978.7895335849175!2d44.80019714100036!3d41.70347898659601!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40440d00342b63e9%3A0xd3aa948231e40ffc!2sIteq%20Georgia!5e0!3m2!1sen!2sam!4v1748864472433!5m2!1sen!2sam"
          
          height="400"
          style={{border:0, width: '100%'}}
          allowFullScreen="" 
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
        {/* <img src={map} className={styles.map} /> */}
      </div>
      <div style={{ margin: "0 10vw" }}>
        <div className={styles.content}>
          <ul className={styles.list}>
            {categoryList.map((c) => {
              let textValue = c.nameEn;
              if (lang === "ge") textValue = c.nameGe;
              else if (lang === "ru") textValue = c.nameRu;
              return (
                <li>
                  <Link to={`/category/${c.id}`}>{textValue}</Link>
                </li>
              );
            })}
          </ul>
          <ul className={styles.list}>
            <li key="discounts" className={styles.listItem}>
              <Link to="/discounts">{t("discount")}</Link>
            </li>
            <li key="aboutus" className={styles.listItem}>
              <Link to="/about">{t("aboutUs")}</Link>
            </li>
            <li key="contacts" className={styles.listItem}>
              <Link to="/contacts">{t("contacts")}</Link>
            </li>
            <li key="news" className={styles.listItem}>
              <Link to="/news">{t("news")}</Link>
            </li>
          </ul>
        </div>
        <div className={styles.socialContent}>
          <div>
            <img src={fb} className={styles.social} />
            <img src={inst} className={styles.social} />
            <img src={twit} className={styles.social} />
          </div>
          <div className={styles.info}>
            <span className={styles.infoItem}>Tbilisi. D.Uznadze St. 2</span>
            <span className={styles.infoItem}>E-mail: info@iteq.ge</span>
            <span className={styles.infoItem}>Tel: 032 2 20 46 60</span>
          </div>
        </div>
      </div>
      <span className={styles.cright}>© Iteq.ge 2025. All rights reserved</span>
    </div>
  );
};

export default Footer;
