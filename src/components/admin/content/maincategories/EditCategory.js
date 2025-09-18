import { Navigate, useNavigate, useParams } from "react-router-dom";
import styles from "../Update.module.css";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { categoryAPI } from "../../dal/api";
import SplashScreen from "../splashscreen/SplashScreen";
import { useTranslation } from "react-i18next";

const EditCategory = () => {
  const { t } = useTranslation();
  const { categoryId } = useParams();
  const [loading, setLoading] = useState(true);
  const [nameEn, setNameEn] = useState("");
  const [nameGe, setNameGe] = useState("");
  const [nameRu, setNameRu] = useState("");
  const [categoryOrder, setCategoryOrder] = useState(0);
  const [imgUrl, setImgUrl] = useState(null);
  const [onTop, setOnTop] = useState(false);
  const formValidationSchema = Yup.object().shape({
      categoryOrder: Yup.string().matches(
        /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
        t("admin_notValid")
      ),
      nameEn: Yup.string().required(t("admin_required")),
      nameGe: Yup.string().required(t("admin_required")),
      nameRu: Yup.string().required(t("admin_required")),
    });

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
        setCategoryOrder(data.data.data.categoryOrder);
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
        initialValues={{
          nameEn: nameEn,
          nameGe: nameGe,
          nameRu: nameRu,
          categoryOrder: categoryOrder,
          onTop: onTop,
        }}
        enableReinitialize
        // validate={(values) => {
        //   const errors = {};
        //   if (!values.nameEn) {
        //     errors.nameEn = "Required";
        //   }
        //   if (!values.nameGe) {
        //     errors.nameGe = "Required";
        //   }
        //   if (!values.nameRu) {
        //     errors.nameRu = "Required";
        //   }
        //   return errors;
        // }}
        validationSchema={formValidationSchema}
        onSubmit={(values, { setSubmitting }) => {
          setLoading(true);
          const formData = new FormData();
          for (let value in values) {
            formData.append(value, values[value]);
          }
          categoryAPI
            .editCategory(formData, categoryId)
            .then(({ data }) => {
              setResultMessage("The category updated successfully");
              return navigate("/admin/categories");
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
              <span className={styles.label}>order:</span>
              <div
                className={styles.formItem}
                style={{textAlign:"left",paddingLeft: "5%",}}
              >
                <input
                  type="input"
                  name="categoryOrder"
                  onChange={(e) => {
                    setCategoryOrder(e.target.value);
                    values.categoryOrder = e.target.value;
                  }}
                  onBlur={handleBlur}
                  value={categoryOrder}
                  className={styles.input}
                  style={{width:"60px", textAlign:"center"}}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.categoryOrder &&
                  touched.categoryOrder &&
                  errors.categoryOrder}
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
                <Field
                  onChange={checkHandle}
                  type="checkbox"
                  name="onTop"
                  style={{ width: "20px", height: "20px", cursor: "pointer" }}
                />
              </div>
              <span></span>
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
                  onClick={() => {
                    return navigate("/admin/categories");
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

export default EditCategory;
