import { useNavigate, useParams } from "react-router-dom";
import styles from "../Update.module.css";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { categoryAPI } from "../../dal/api";
import SplashScreen from "../splashscreen/SplashScreen";

const AddCategory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  return (
    <div className={styles.data}>
      {loading && <SplashScreen />}
      <Formik
        initialValues={{ nameEn: "", nameGe: "", nameRu: "", imgUrl: "", onTop:false }}
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
          if (!values.imgUrl) {
            errors.imgUrl = "Required";
          }

          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          const formData = new FormData();
          for (let value in values) {
            formData.append(value, values[value]);
          }
          setLoading(true);
          categoryAPI
            .addCategory(formData)
            .then((data) => {
              setResultMessage("The category added successfully");
              return navigate('/admin/categories');
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
              <span className={styles.label}>on top page:</span>
              <div
                className={styles.formItem}
                style={{
                  textAlign: "left",
                  paddingLeft: "5%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Field type="checkbox" name="onTop" style={{width: '20px', height: '20px', cursor: 'pointer'}}/>
                {/* <input
                  type="checkbox"
                  name="productDiscount"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.productDiscount}
                  className={styles.input}
                  style={{ width: "20px" }}
                /> */}
              </div><span></span>
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
                  onClick={()=>{ return navigate('/admin/categories');}}
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

export default AddCategory;
