import { useNavigate, useParams } from "react-router-dom";
import styles from "../../Update.module.css";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { modelAPI, productsAPI } from "../../../dal/api";
import SplashScreen from "../../splashscreen/SplashScreen";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";

const AddModelSize = ({modelId, closeModal,sizeAdded}) => {
  const [resultMessage, setResultMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const formValidationSchema = Yup.object().shape({
    price: Yup.string().matches(
      /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
      t("admin_notValid")
    ),
    newPrice: Yup.string().matches(
      /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
      t("admin_notValid")
    ),
    count: Yup.string().matches(
      /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
      t("admin_notValid")
    ),
  });

  return (
    <div className={styles.data}>
      {loading && <SplashScreen />}
      <Formik
        initialValues={{
          dimension: "",
          weight: "",
          price: 0,
          discount: false,
          newPrice: 0,
          count: 0,
          inStock: true,
        }}
        validationSchema={formValidationSchema}
        onSubmit={(values, { setSubmitting, resetForm  }) => {
          {
            /* replace( /\r?\n/gi, '' ) */
          }
          setLoading(true);
          const formData = new FormData();
          for (let value in values) {
            formData.append(value, values[value]);
          }
          values["modelId"] = modelId;
          modelAPI
            .addSize(values)
            .then((data) => {
              setResultMessage(t("admin_sizeAddSuccess"));
              resetForm();
              sizeAdded();
            })
            .catch((error) => {
              setResultMessage(t("admin_sizeAddFailed"));
            }).finally(()=>{
              setLoading(false);
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
              <span className={styles.label}>{t("admin_size")}:</span>
              <div className={styles.formItem}>
                <input
                  type="input"
                  name="dimension"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.dimension}
                  className={styles.input}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.dimension && touched.dimension && errors.dimension}
              </span>
              <span className={styles.label}>{t("admin_weight")}:</span>
              <div className={styles.formItem}>
                <input
                  type="input"
                  name="weight"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.weight}
                  className={styles.input}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.weight && touched.weight && errors.weight}
              </span>
              <span className={styles.label}>{t("admin_price")}:</span>
              <div className={styles.formItem}>
                <input
                  type="input"
                  name="price"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.price}
                  className={styles.input}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.price && touched.price && errors.price}
              </span>
              <span className={styles.label}>{t("admin_discount")}:</span>
              <div
                className={styles.formItem}
                style={{
                  textAlign: "left",
                  paddingLeft: "5%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Field type="checkbox" name="discount" />
              </div>
              <span className={`${styles.label} ${styles.error}`}></span>

              <span className={styles.label}>{t("admin_newPrice")}: &#8382;</span>
              <div
                className={styles.formItem}
                style={{ textAlign: "left", paddingLeft: "5%" }}
              >
                <input
                  type="text"
                  name="newPrice"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.newPrice}
                  className={styles.input}
                  style={{ width: "140px" }}
                  disabled={!values.discount}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.productNewPrice}
              </span>
              <span className={styles.label}>{t("admin_count")}:</span>
              <div
                className={styles.formItem}
                style={{ textAlign: "left", paddingLeft: "5%" }}
              >
                <input
                  type="input"
                  name="count"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.count}
                  className={styles.input}
                  style={{ width: "140px" }}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.count && touched.count && errors.count}
              </span>

              <span className={styles.label}>{t("admin_inStock")}:</span>
              <div
                className={styles.formItem}
                style={{
                  textAlign: "left",
                  paddingLeft: "5%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Field type="checkbox" name="inStock" />
              </div>
              <span className={`${styles.label} ${styles.error}`}></span>
              <div className={`${styles.formItem} ${styles.col3}`}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.btn}
                >
                  {t("admin_add")}
                </button>
                <button
                  type="button"
                  className={styles.btn}
                  // onClick={()=>{ return navigate(`/admin/productSizes/${id}`);}}
                  onClick={()=> closeModal()}
                >
                  {t("admin_close")}
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

export default AddModelSize;
