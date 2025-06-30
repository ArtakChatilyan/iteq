import { useNavigate, useParams } from "react-router-dom";
import styles from "../Update.module.css";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import SplashScreen from "../splashscreen/SplashScreen";
import { colorAPI } from "../../dal/api";

const AddColor = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [resultMessage, setResultMessage] = useState("");

  return (
    <div className={styles.data}>
      {loading && <SplashScreen />}
      <Formik
        initialValues={{ nameEn: "", nameGe: "", nameRu: "", iconUrl: "" }}
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

          colorAPI
            .addColor(formData)
            .then((response) => {
              setResultMessage("Color added successfully");
              return navigate("/admin/colors");
            })
            .catch((error) => {
              setResultMessage("Couldn't add color!");
            });
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
               <span className={styles.label}>image:</span>
              <div className={styles.formItem}>
                <input
                  type="file"
                  name="iconUrl"
                  accept="image/*"
                  onChange={(e) => {
                    setFieldValue("iconUrl", e.currentTarget.files[0]);
                    
                  }}
                  className={styles.input}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.imgUrl && touched.imgUrl && errors.imgUrl}
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
                  onClick={() => {
                    return navigate("/admin/colors");
                  }}
                >
                  cancel
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

export default AddColor;
