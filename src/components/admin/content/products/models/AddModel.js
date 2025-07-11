import styles from "../../Update.module.css";
import { Field, Formik } from "formik";
import { useState } from "react";
import { modelAPI } from "../../../dal/api";
import SplashScreen from "../../splashscreen/SplashScreen";

const AddModel = ({ productId, closeModal }) => {
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  return (
    <div className={styles.data}>
      {loading && <SplashScreen />}
      <Formik
        initialValues={{ nameEn: "", nameGe: "", nameRu: "" }}
        validate={(values) => {
          const errors = {};
          if (!values.nameEn) {
            errors.nameEn = "Required";
          }
          if (!values.nameGe) {
            errors.nameGe = "Required";
          }
          if (!values.nameRu) {
            errors.nameRu = "Required";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setLoading(true);
          const formData = new FormData();
          for (let value in values) {
            formData.append(value, values[value]);
          }

          modelAPI
            .addModel(productId, values)
            .then((data) => {
              setResultMessage("The model added successfully");
              closeModal();
            })
            .catch((error) => {
              setResultMessage("Failed to add model!");
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
              <span className={styles.label}>name(english):</span>
              <div className={styles.formItem}>
                <input
                  type="input"
                  name="nameEn"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.nameEn}
                  className={styles.input}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.nameEn && touched.nameEn && errors.nameEn}
              </span>
              <span className={styles.label}>name(georgian):</span>
              <div className={styles.formItem}>
                <input
                  type="input"
                  name="nameGe"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.nameGe}
                  className={styles.input}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.nameGe && touched.nameGe && errors.nameGe}
              </span>
              <span className={styles.label}>name(russian):</span>
              <div className={styles.formItem}>
                <input
                  type="input"
                  name="nameRu"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.nameRu}
                  className={styles.input}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.nameRu && touched.nameRu && errors.nameRu}
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

export default AddModel;
