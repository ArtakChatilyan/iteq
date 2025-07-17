import styles from "./../Products.module.css";
import { Formik } from "formik";
import SplashScreen from "../../splashscreen/SplashScreen";
import { productsAPI } from "../../../dal/api";
import { useState } from "react";

const AddDescription = ({ productId, closeModal }) => {
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  return (
    <div>
        {loading && <SplashScreen />}
      <Formik
        initialValues={{
          descriptionName: "",
          descriptionEn: "",
          descriptionGe: "",
          descriptionRu: "",
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setLoading(true);
          const formData = new FormData();
          for (let value in values) {
            formData.append(value, values[value]);
          }
          values["productId"] = productId;
          productsAPI
            .addDescription(values)
            .then((data) => {
              setResultMessage("Description added successfully");
              resetForm();
            })
            .catch((error) => {
              setResultMessage("Failed to add description!");
            })
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
              <span className={styles.label}>description name:</span>
              <div className={styles.formItem}>
                <input
                  className={styles.input}
                  name="descriptionName"
                  value={values.descriptionName}
                  onChange={handleChange}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.descriptionEn &&
                  touched.descriptionEn &&
                  errors.descriptionEn}
              </span>
              <span className={styles.label}>description(english):</span>
              <div className={styles.formItem}>
                <textarea
                  className={`${styles.input} ${styles.area}`}
                  name="descriptionEn"
                  value={values.descriptionEn}
                  onChange={handleChange}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.descriptionEn &&
                  touched.descriptionEn &&
                  errors.descriptionEn}
              </span>
              <span className={styles.label}>description(georgian):</span>
              <div className={styles.formItem}>
                <textarea
                  className={`${styles.input} ${styles.area}`}
                  name="descriptionGe"
                  value={values.descriptionGe}
                  onChange={handleChange}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.descriptionGe &&
                  touched.descriptionGe &&
                  errors.descriptionGe}
              </span>
              <span className={styles.label}>description(russian):</span>
              <div className={styles.formItem}>
                <textarea
                  className={`${styles.input} ${styles.area}`}
                  name="descriptionRu"
                  value={values.descriptionRu}
                  onChange={handleChange}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.descriptionRu &&
                  touched.descriptionRu &&
                  errors.descriptionRu}
              </span>
              <div className={`${styles.formItem} ${styles.col3}`}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.btn}
                >
                  add
                </button>
                <button
                  type="button"
                  className={styles.btn}
                  onClick={() => closeModal()}
                >
                  close
                </button>
              </div>
              <div className={`${styles.formItem} ${styles.col3}`}>
                {resultMessage}
              </div>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default AddDescription;
