import { Navigate, useNavigate, useParams } from "react-router-dom";
import styles from "../Update.module.css";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { categoryAPI } from "../../dal/api";
import SplashScreen from "../splashscreen/SplashScreen";

const EditCategory = () => {
  const {categoryId}=useParams();
  const [loading, setLoading] = useState(true);
  const [nameEn, setNameEn] = useState("");
  const [nameGe, setNameGe] = useState("");
  const [nameRu, setNameRu] = useState("");
  const [imgUrl, setImgUrl] = useState(null);
  const [onTop, setOnTop] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    getCategory(categoryId);
  }, []);

  const getCategory = (id) => {
    categoryAPI.getCategory(id).then((data) => {
      if (data) {
        setNameEn(data.data.data.nameEn);
        setNameGe(data.data.data.nameGe);
        setNameRu(data.data.data.nameRu);
        setImgUrl(data.data.data.imgUrl);
        setOnTop(data.data.data.onTop);
      }
      setLoading(false);
    });
  };

  const [resultMessage, setResultMessage] = useState("");
  const checkHandle = (e) => {
    setOnTop(e.currentTarget.checked);
  };
  return (
    <div className={styles.data}>
      {loading && <SplashScreen />}
      <Formik
        initialValues={{nameEn: nameEn, nameGe:nameGe, nameRu:nameRu, onTop: onTop}}
        enableReinitialize
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
          categoryAPI
            .editCategory(formData, categoryId)
            .then(({data}) => {
              setResultMessage("The category updated successfully");
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
                  onChange={(e) => {
                    setNameEn(e.target.value);
                    values.nameEn = e.target.value;
                  }}
                  onBlur={handleBlur}
                  value={nameEn}
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
                  onChange={(e) => {
                    setNameGe(e.target.value);
                    values.nameGe = e.target.value;
                  }}
                  onBlur={handleBlur}
                  value={nameGe}
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
                  onChange={(e) => {
                    setNameRu(e.target.value);
                    values.nameRu = e.target.value;
                  }}
                  onBlur={handleBlur}
                  value={nameRu}
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
                <Field onChange={checkHandle}
                  type="checkbox"
                  name="onTop"
                  style={{ width: "20px", height: "20px", cursor: "pointer" }}
                />
              </div><span></span>
              <span className={styles.label}>image:</span>
              <div className={styles.formItem}>
                <img src={imgUrl} style={{ width: "200px", margin: "20px" }} />
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
              <div className={`${styles.formItem} ${styles.col3}`}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.btn}
                >
                  edit
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

export default EditCategory;
