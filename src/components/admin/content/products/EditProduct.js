import { useNavigate, useParams } from "react-router-dom";
import styles from "../Update.module.css";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { brandsAPI, productsAPI } from "../../dal/api";
import SplashScreen from "../splashscreen/SplashScreen";
import * as Yup from "yup";
import ProductImages from "./ProductImages";
import ProductDescriptions from "./descriptions/ProductDescriptions";
import ProductCategories from "./ProductCategories";
import Models from "./models/Models";
import { useTranslation } from "react-i18next";

const EditProduct = () => {
  const { itemId, page, sType, sTerm, sCat } = useParams();
  const navigate = useNavigate();
  const [resultMessage, setResultMessage] = useState("");
  const [brandData, setBrandData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const [productNameEn, setProductNameEn] = useState("");
  const [productNameGe, setProductNameGe] = useState("");
  const [productNameRu, setProductNameRu] = useState("");
  const [productBrand, setProductBrand] = useState(0);
  const [productCountryEn, setProductCountryEn] = useState("");
  const [productCountryGe, setProductCountryGe] = useState("");
  const [productCountryRu, setProductCountryRu] = useState("");

  const [productInStock, setProductInStock] = useState("");
  const [productOnTop, setProductOnTop] = useState("");

  const formValidationSchema = Yup.object().shape({
    productNameEn: Yup.string().required("required"),
    productNameGe: Yup.string().required("required"),
    productNameRu: Yup.string().required("required"),
  });
  useEffect(() => {
    brandsAPI.getBrandsAll().then((response) => {
      if (response) {
        setBrandData(response.data.data);
      }
    });
    getProduct(itemId);
  }, []);

  const getProduct = (id) => {
    productsAPI.getProduct(id).then((response) => {
      if (response.data.data.id) {
        console.log(response.data.data);
        
        setProductNameEn(response.data.data.productNameEn);
        setProductNameGe(response.data.data.productNameGe);
        setProductNameRu(response.data.data.productNameRu);
        setProductBrand(response.data.data.productBrand);
        setProductCountryEn(response.data.data.productCountryEn);
        setProductCountryGe(response.data.data.productCountryGe);
        setProductCountryRu(response.data.data.productCountryRu);
        setProductInStock(response.data.data.productInStock);
        setProductOnTop(response.data.data.productOnTop);
      }
      setLoading(false);
    });
  };

  const checkInStockHandle = (e) => {
    setProductInStock(e.currentTarget.checked);
  };
  
  const checkOnTopHandle = (e) => {
    setProductOnTop(e.currentTarget.checked);
  };

  return (
    <div className={styles.data}>
      {loading && <SplashScreen />}
      <Formik
        enableReinitialize
        initialValues={{
          productNameEn: productNameEn,
          productNameGe: productNameGe,
          productNameRu: productNameRu,
          productBrand: productBrand,
          productCountryEn: productCountryEn,
          productCountryGe: productCountryGe,
          productCountryRu: productCountryRu,
          productInStock: productInStock,
          productOnTop: productOnTop,
        }}
        validationSchema={formValidationSchema}
        onSubmit={(values, { setSubmitting }) => {
          setLoading(true);
          const formData = new FormData();
          for (let value in values) {
            formData.append(value, values[value]);
          }
          productsAPI
            .editProduct(values, itemId)
            .then((data) => {
              setResultMessage(t("admin_producteditsuccess"));
            })
            .catch((error) => {
              setResultMessage(t("admin_producteditfailed"));
            })
            .finally(() => {
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
              <span className={styles.label}>{t("admin_nameEn")}:</span>
              <div className={styles.formItem}>
                <input
                  type="input"
                  name="productNameEn"
                  onChange={(e) => {
                    setProductNameEn(e.target.value);
                    values.productNameEn = e.target.value;
                  }}
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
                  onChange={(e) => {
                    setProductNameGe(e.target.value);
                    values.productNameGe = e.target.value;
                  }}
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
                  onChange={(e) => {
                    setProductNameRu(e.target.value);
                    values.productNameRu = e.target.value;
                  }}
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
                  onChange={(e) => setProductBrand(e.currentTarget.value)}
                  value={productBrand}
                >
                  <option value="0"></option>
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
                  onChange={(e) => {
                    setProductCountryEn(e.target.value);
                    values.productCountryEn = e.target.value;
                  }}
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
                  onChange={(e) => {
                    setProductCountryGe(e.target.value);
                    values.productCountryGe = e.target.value;
                  }}
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
                  onChange={(e) => {
                    setProductCountryRu(e.target.value);
                    values.productCountryRu = e.target.value;
                  }}
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
                <Field
                  type="checkbox"
                  name="productInStock"
                  onChange={checkInStockHandle}
                />
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
                <Field
                  type="checkbox"
                  name="productOnTop"
                  onChange={checkOnTopHandle}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}></span>

              <div className={`${styles.formItem} ${styles.col3}`}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.btn}
                >
                  {t("admin_edit")}
                </button>
                <button
                  type="button"
                  className={styles.btn}
                  onClick={() => {
                    return navigate(
                      `/admin/products/${page}/${sType}/${sTerm}/${sCat}`
                    );
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
      <Models productId={itemId} />
      <ProductCategories productId={itemId} />
      <ProductImages productId={itemId} />
      <ProductDescriptions productId={itemId} />
    </div>
  );
};

export default EditProduct;
