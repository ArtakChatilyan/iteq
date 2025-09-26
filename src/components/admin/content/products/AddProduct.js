import { useNavigate, useParams } from "react-router-dom";
import styles from "../Update.module.css";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { brandsAPI, productsAPI } from "../../dal/api";
import SplashScreen from "../splashscreen/SplashScreen";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";

const AddProduct = () => {
  const { page, sType, sTerm, sCat } = useParams();
  
  const navigate = useNavigate();
  const [resultMessage, setResultMessage] = useState("");
  const [brandData, setBrandData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const formValidationSchema = Yup.object().shape({
    productNameEn: Yup.string().required(t("admin_required")),
    productNameGe: Yup.string().required(t("admin_required")),
    productNameRu: Yup.string().required(t("admin_required")),
  });
  useEffect(() => {
    brandsAPI.getBrandsAll().then((response) => {
      if (response) {
        setBrandData(response.data.data);
      }
      setLoading(false);
    });
  }, []);


  return (
    <div className={styles.data}>
      {loading && <SplashScreen />}
      <Formik
        initialValues={{
          productNameEn: "",
          productNameGe: "",
          productNameRu: "",
          productBrand: brandData.length>0 ? brandData.filter(bd=>bd.brandName==sTerm)[0].id : 0,
          productCountryEn: "",
          productCountryGe: "",
          productCountryRu: "",
          productInStock: true,
          productOnTop: false,
        }}
        validationSchema={formValidationSchema}
        onSubmit={(values, { setSubmitting }) => {
          {
            /* replace( /\r?\n/gi, '' ) */
          }
          setLoading(true);
          const formData = new FormData();

          for (let value in values) {
            formData.append(value, values[value]);
          }
          productsAPI
            .addProduct(values)
            .then((data) => {
              setResultMessage(t("admin_productaddsuccess"));
              return navigate(`/admin/products/${page}/${sType}/${sTerm}/${sCat}`);
            })
            .catch((error) => {
              setResultMessage(t("admin_productaddfailed"));
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
              <span className={styles.label}>{t("admin_nameEn")}:</span>
              <div className={styles.formItem}>
                <input
                  type="input"
                  name="productNameEn"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.productNameEn}
                  className={styles.input}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.productNameEn &&
                  touched.productNameEn &&
                  errors.productNameEn}
              </span>
              <span className={styles.label}>{t("admin_nameGe")}:</span>
              <div className={styles.formItem}>
                <input
                  type="input"
                  name="productNameGe"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.productNameGe}
                  className={styles.input}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.productNameGe &&
                  touched.productNameGe &&
                  errors.productNameGe}
              </span>
              <span className={styles.label}>{t("admin_nameRu")}:</span>
              <div className={styles.formItem}>
                <input
                  type="input"
                  name="productNameRu"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.productNameRu}
                  className={styles.input}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.productNameRu &&
                  touched.productNameRu &&
                  errors.productNameRu}
              </span>

              <span className={styles.label}>{t("admin_brand")}:</span>
              <div className={styles.formItem}>
                <Field
                  as="select"
                  name="productBrand"
                  className={styles.options}
                >
                  <option value={0}></option>
                  {brandData.map((d) => (
                    <option key={`br${d.id}`} value={d.id}>
                      {d.brandName}
                    </option>
                  ))}
                </Field>
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.productBrand &&
                  touched.productBrand &&
                  errors.productBrand}
              </span>

              <span className={styles.label}>{t("admin_countryEn")}:</span>
              <div className={styles.formItem}>
                <input
                  type="input"
                  name="productCountryEn"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.productCountryEn}
                  className={styles.input}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}></span>

              <span className={styles.label}>{t("admin_countryGe")}:</span>
              <div className={styles.formItem}>
                <input
                  type="input"
                  name="productCountryGe"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.productCountryGe}
                  className={styles.input}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}></span>
              <span className={styles.label}>{t("admin_countryRu")}:</span>
              <div className={styles.formItem}>
                <input
                  type="input"
                  name="productCountryRu"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.productCountryRu}
                  className={styles.input}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}></span>

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
                <Field type="checkbox" name="productInStock" />
              </div>
              <span className={`${styles.label} ${styles.error}`}></span>
              
              <span className={styles.label}>{t("admin_onTop")}:</span>
              <div
                className={styles.formItem}
                style={{
                  textAlign: "left",
                  paddingLeft: "5%",
                  verticalAlign: "middle",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Field type="checkbox" name="productOnTop" />
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
                  onClick={() => {
                    return navigate(`/admin/products/${page}/${sType}/${sTerm}/${sCat}`);
                  }}
                >
                  {t("admin_cancel")}
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

export default AddProduct;
