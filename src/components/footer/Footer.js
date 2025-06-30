import styles from "./Footer.module.css";
import fb from "../../assets/icons8-facebook.svg";
import inst from "../../assets/icons8-instagram.svg";
import twit from "../../assets/icons8-twitter-bird.svg";
import { useEffect, useState } from "react";
import { categoryAPI, settingsAPI } from "../dalUser/userApi";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Cookies from "universal-cookie";
import LoadingScreen from "../loadingScreen/LoadingScreen";

const Footer = ({ lang }) => {
  const { t, i18n } = useTranslation();
  const cookies = new Cookies();

  const [addressEn, setAddressEn] = useState(" ");
  const [addressGe, setAddressGe] = useState("");
  const [addressRu, setAddressRu] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    LoadSettings();
    LoadCategories();
  }, []);

  const LoadSettings = () => {
    settingsAPI
      .getContacts()
      .then((response) => {
        setAddressEn(response.data.contacts.addressEn);
        setAddressGe(response.data.contacts.addressGe);
        setAddressRu(response.data.contacts.addressRu);
        setEmail(response.data.contacts.email);
        setPhone(response.data.contacts.phone);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2977.2032457039054!2d44.77891605978845!3d41.737708784006564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40440c52003fc05d%3A0x7a39577e45c03c61!2sITEQ%20GEORGIA!5e0!3m2!1sen!2sam!4v1749543688042!5m2!1sen!2sam"
          height="400"
          style={{ border: 0, width: "100%" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      <div style={{ margin: "0 10vw" }}>
        <div className={styles.content}>
          <ul className={styles.list}>
            {categoryList.map((c) => {
              let textValue = c.nameEn;
              if (lang === "ge") textValue = c.nameGe;
              else if (lang === "ru") textValue = c.nameRu;
              return (
                <li key={`cat${c.id}`}>
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
            <span className={styles.infoItem}>
              {lang === "en" && addressEn}
              {lang === "ge" && addressGe}
              {lang === "ru" && addressRu}
            </span>
            <span className={styles.infoItem}>E-mail: {email}</span>
            <span className={styles.infoItem}>Tel: {phone}</span>
          </div>
        </div>
      </div>
      <span className={styles.cright}>© Iteq.ge 2025. All rights reserved</span>
    </div>
  );
};

export default Footer;
