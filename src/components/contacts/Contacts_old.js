import styles from "./Contacts.module.css";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import loadingImg from "../../assets/loading.gif";
import * as Yup from "yup";
import { usersAPI } from "../dalUser/userApi";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ContactsSeoData } from "../seotags/ContactsSEO";

const Contacts = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const [resultMessage, setResultMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [seoData, setSeoData] = useState(null);

  const formValidationSchema = Yup.object().shape({
    Firstname: Yup.string().required(t("required")),
    Lastname: Yup.string().required(t("required")),
    Email: Yup.string()
      .required(t("required"))
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        t("incorrectEmail")
      ),
    Phone: Yup.string().matches(
      /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
      t("incorrectPhone")
    ),
    Message: Yup.string().required(t("required")),
  });
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
      <div className={styles.data}>
        {loading && (
          <div className={styles.loadingWrapper}>
            <img src={loadingImg} className={styles.loading} />
          </div>
        )}
        <Formik
          initialValues={{
            Firstname: "",
            Lastname: "",
            Email: "",
            Phone: "",
            Message: "",
          }}
          validationSchema={formValidationSchema}
          onSubmit={(values, { resetForm }) => {
            setLoading(true);
            const formData = new FormData();

            for (let value in values) {
              formData.append(value, values[value]);
            }
            usersAPI
              .sendEmail(values)
              .then((response) => {
                setResultMessage(t("messageSuccess"));
                resetForm();
              })
              .catch((error) => {})
              .finally(() => setLoading(false));
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue,
            /* and other goodies */
          }) => (
            <form onSubmit={handleSubmit}>
              <div className={styles.form}>
                <div className={styles.formItem}>
                  <input
                    type="input"
                    name="Firstname"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.Firstname}
                    className={styles.input}
                    placeholder={t("firstName") + "*"}
                  />
                </div>
                <span className={`${styles.label} ${styles.error}`}>
                  {errors.Firstname && touched.Firstname && errors.Firstname}
                </span>

                <div className={styles.formItem}>
                  <input
                    type="input"
                    name="Lastname"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.Lastname}
                    className={styles.input}
                    placeholder={t("lastName") + "*"}
                  />
                </div>
                <span className={`${styles.label} ${styles.error}`}>
                  {errors.Lastname && touched.Lastname && errors.Lastname}
                </span>

                <div className={styles.formItem}>
                  <input
                    type="input"
                    name="Email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.Email}
                    className={styles.input}
                    placeholder={t("email") + "*"}
                  />
                </div>
                <span className={`${styles.label} ${styles.error}`}>
                  {errors.Email && touched.Email && errors.Email}
                </span>

                <div className={styles.formItem}>
                  <input
                    type="input"
                    name="Phone"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.Phone}
                    className={styles.input}
                    placeholder={t("phone") + "*"}
                  />
                </div>
                <span className={`${styles.label} ${styles.error}`}>
                  {errors.Phone && touched.Phone && errors.Phone}
                </span>

                <div className={styles.formItem}>
                  <textarea
                    className={`${styles.input} ${styles.area}`}
                    name="Message"
                    value={values.Message}
                    onChange={handleChange}
                    placeholder={t("message") + "*"}
                  />
                </div>
                <span className={`${styles.label} ${styles.error}`}>
                  {errors.Message && touched.Message && errors.Message}
                </span>

                <div className={`${styles.formItem} ${styles.col3}`}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={styles.btn}
                  >
                    {t("send")}
                  </button>
                </div>
                <div
                  className={`${styles.formItem} ${styles.col3} ${styles.message}`}
                >
                  {resultMessage}
                </div>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default Contacts;
