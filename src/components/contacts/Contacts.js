import styles from "./Contacts.module.css";
import { useEffect, useState } from "react";
import loadingImg from "../../assets/loading.gif";
import { settingsAPI } from "../dalUser/userApi";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ReactPlayer from "react-player";
import { ContactsSeoData } from "../seotags/ContactsSEO";
import fb from "../../assets/icons8-facebook.svg";
import inst from "../../assets/icons8-instagram.svg";
import tik from "../../assets/icon-tiktok.svg";

const Contacts = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const [seoData, setSeoData] = useState(null);
  const [addressEn, setAddressEn] = useState(" ");
  const [addressGe, setAddressGe] = useState("");
  const [addressRu, setAddressRu] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    LoadSettings();
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
        setMediaUrl(response.data.contacts.mediaUrl);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (lang) setSeoData(ContactsSeoData[lang]);
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
            href="https://iteq.shop/en/contact/"
            hrefLang="en"
          />
          <link
            rel="alternate"
            href="https://iteq.shop/ru/contact/"
            hrefLang="ru"
          />
          <link
            rel="alternate"
            href="https://iteq.shop/ka/contact/"
            hrefLang="ka"
          />
          <link
            rel="alternate"
            href="https://iteq.shop/contact/"
            hrefLang="x-default"
          />

          {/* JSON-LD structured data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(seoData.jsonld) }}
          />
        </Helmet>
      )}
      <section className={styles.section}>
        <div className={styles.block}>
          {loading && (
            <div className={styles.loadingWrapper}>
              <img src={loadingImg} className={styles.loading} />
            </div>
          )}
          <div className={styles.socialContent}>
            <div className={styles.nets}>
              <Link
                to="https://www.facebook.com/share/14Ntk7ZEf8t/?mibextid=wwXIfr"
                target="blank"
              >
                <img src={fb} className={styles.social} />
              </Link>

              <Link
                to="https://www.instagram.com/iteqgeorgia?igsh=OHJkZjN5aXl4cWNn"
                target="blank"
              >
                <img src={inst} className={styles.social} />
              </Link>

              <Link
                to="https://www.tiktok.com/@iteqgeorgiallc?_t=ZS-90EzqCy69Hr&_r=1"
                target="blank"
              >
                <img src={tik} className={styles.social} />{" "}
              </Link>
            </div>
            <div className={styles.info}>
              <span className={styles.infoItem}>E-mail: {email}</span>
              <span className={styles.infoItem}>Tel: {phone}</span>
              <span className={styles.infoItem}>
                {lang === "en" && addressEn}
                {lang === "ka" && addressGe}
                {lang === "ru" && addressRu}
              </span>
            </div>
          </div>
          <div className={styles.media}>
            {mediaUrl && (
              <ReactPlayer
                style={{ width: "100%", height: "100%" }}
                src={mediaUrl}
                playing={true}
                controls={true}
                muted={true}
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Contacts;
