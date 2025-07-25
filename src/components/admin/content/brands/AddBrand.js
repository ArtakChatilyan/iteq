import styles from "../Update.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { brandsAPI, categoryAPI } from "../../dal/api";
import SplashScreen from "../splashscreen/SplashScreen";

const AddBrand = () => {
  const {page}=useParams();
  const navigate = useNavigate();
  const[loading, setLoading]=useState(false);
  const [resultMessage, setResultMessage] = useState("");
  return (
    <div className={styles.data}>
      {loading && <SplashScreen />}
      <Formik
        initialValues={{ brandName: "", brandUrl: "", imgUrl: null }}
        validate={(values) => {
          const errors = {};
          if (!values.brandName) {
            errors.brandName = "Required";
          }

          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setLoading(true);
          const formData = new FormData();
          for (let value in values) {
            formData.append(value, values[value]);
          }
          brandsAPI
            .addBrand(formData)
            .then((data) => {
              setResultMessage("The brand added successfully");
              return navigate(`/admin/brands/${page}`);
            })
            .catch((error) => {
              setResultMessage("Couldn't add category!");
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
              <span className={styles.label}>barnd name:</span>
              <div className={styles.formItem}>
                <input
                  type="input"
                  name="brandName"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.brandName}
                  className={styles.input}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.nameEn && touched.nameEn && errors.nameEn}
              </span>
              <span className={styles.label}>brand url:</span>
              <div className={styles.formItem}>
                <input
                  type="input"
                  name="brandUrl"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.brandUrl}
                  className={styles.input}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.brandUrl && touched.brandUrl && errors.brandUrl}
              </span>
              <span className={styles.label}>image:</span>
              <div className={styles.formItem}>
                <input
                  type="file"
                  name="imgUrl"
                  accept="image/*"
                  onChange={(e) => {
                    setFieldValue("imgUrl", e.currentTarget.files[0]);
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
                  onClick={()=>{ return navigate(`/admin/brands/${page}`);}}
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

export default AddBrand;

