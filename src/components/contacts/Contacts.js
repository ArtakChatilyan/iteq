import styles from "./Contacts.module.css";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import loadingImg from "../../assets/loading.gif";
import * as Yup from "yup";
import { usersAPI } from "../dalUser/userApi";
import { useTranslation } from "react-i18next";

const Contacts = () => {
  const { t, i18n } = useTranslation();
  const [resultMessage, setResultMessage] = useState("");
  const [loading, setLoading] = useState(false);

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
  useEffect(() => {}, []);
  return (
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
                  placeholder={t("firstName")+'*'}
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
                  placeholder={t("lastName")+'*'}
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
                  placeholder={t("email")+'*'}
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
                  placeholder={t("phone")+'*'}
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
                  placeholder={t("message")+'*'}
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
              <div className={`${styles.formItem} ${styles.col3} ${styles.message}`}>
                {resultMessage}
              </div>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default Contacts;
