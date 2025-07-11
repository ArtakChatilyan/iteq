import { useNavigate, useParams } from "react-router-dom";
import styles from "../Update.module.css";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { brandsAPI, productsAPI } from "../../dal/api";
import SplashScreen from "../splashscreen/SplashScreen";
import * as Yup from "yup";

const AddProduct = () => {
  const { page, sType } = useParams();
  const navigate = useNavigate();
  const [resultMessage, setResultMessage] = useState("");
  const [brandData, setBrandData] = useState([]);
  const [loading, setLoading] = useState(true);

  // const [modelsEn, setModelsEn] = useState([]);
  // const [modelsGe, setModelsGe] = useState([]);
  // const [modelsRu, setModelsRu] = useState([]);

  // const [optionFieldsEn, setOptionFieldsEn] = useState([]);
  // const [optionFieldsGe, setOptionFieldsGe] = useState([]);
  // const [optionFieldsRu, setOptionFieldsRu] = useState([]);

  const formValidationSchema = Yup.object().shape({
    productNameEn: Yup.string().required("required"),
    productNameGe: Yup.string().required("required"),
    productNameRu: Yup.string().required("required"),
    // productModel: Yup.string().required("required"),
    // productPrice: Yup.string().matches(
    //   /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
    //   "not valid"
    // ),
    // productNewPrice: Yup.string().matches(
    //   /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
    //   "not valid"
    // ),
    // productCount: Yup.string().matches(
    //   /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
    //   "not valid"
    // ),
  });
  useEffect(() => {
    brandsAPI.getBrandsAll().then((response) => {
      if (response) {
        setBrandData(response.data.data);
      }
      setLoading(false);
    });
  }, []);

  // const addModel=()=>{
    
  // }

  // const addOption = () => {
  //   setOptionFieldsEn([
  //     ...optionFieldsEn,
  //     { optionNameEn: "", optionValueEn: "" },
  //   ]);
  //   setOptionFieldsGe([
  //     ...optionFieldsGe,
  //     { optionNameGe: "", optionValueGe: "" },
  //   ]);
  //   setOptionFieldsRu([
  //     ...optionFieldsRu,
  //     { optionNameRu: "", optionValueRu: "" },
  //   ]);
  // };

  // const removeOption = (index, lang) => {
  //   const newOptionsEn = [...optionFieldsEn];
  //   newOptionsEn.splice(index, 1);
  //   setOptionFieldsEn(newOptionsEn);

  //   const newOptionsGe = [...optionFieldsGe];
  //   newOptionsGe.splice(index, 1);
  //   setOptionFieldsGe(newOptionsGe);

  //   const newOptionsRu = [...optionFieldsRu];
  //   newOptionsRu.splice(index, 1);
  //   setOptionFieldsRu(newOptionsRu);
  // };

  // const handleOptionCahnge = (index, event, lang, term) => {
  //   let values;
  //   switch (lang) {
  //     case "en":
  //       values = [...optionFieldsEn];
  //       if (term === "n") {
  //         values[index].optionNameEn = event.target.value;
  //         setOptionFieldsEn(values);
  //       } else {
  //         values[index].optionValueEn = event.target.value;
  //         setOptionFieldsEn(values);
  //       }
  //       break;
  //     case "ge":
  //       values = [...optionFieldsGe];
  //       if (term === "n") {
  //         values[index].optionNameGe = event.target.value;
  //         setOptionFieldsGe(values);
  //       } else {
  //         values[index].optionValueGe = event.target.value;
  //         setOptionFieldsGe(values);
  //       }
  //       break;
  //     case "ru":
  //       values = [...optionFieldsRu];
  //       if (term === "n") {
  //         values[index].optionNameRu = event.target.value;
  //         setOptionFieldsRu(values);
  //       } else {
  //         values[index].optionValueRu = event.target.value;
  //         setOptionFieldsRu(values);
  //       }
  //       break;
  //   }
  // };

  return (
    <div className={styles.data}>
      {loading && <SplashScreen />}
      <Formik
        initialValues={{
          productNameEn: "",
          productNameGe: "",
          productNameRu: "",
          //productModel: "",
          productBrand: 0,
          productCountryEn: "",
          productCountryGe: "",
          productCountryRu: "",
          //productMultyColor: false,
          //productMultyDimension: false,
          //productDimension: "",
          //productWeight: "",
          //productInfoEn: "",
          //productInfoGe: "",
          //productInfoRu: "",
          //productPrice: "",
          //productDiscount: false,
          //productNewPrice: "",
          productInStock: true,
          //productCount: 0,
          //productPopular: false,
          productOnTop: false,
        }}
        validationSchema={formValidationSchema}
        onSubmit={(values, { setSubmitting }) => {
          {
            /* replace( /\r?\n/gi, '' ) */
          }
          setLoading(true);
          const formData = new FormData();

          // values["optionsEn"] = JSON.stringify(optionFieldsEn);
          // values["optionsGe"] = JSON.stringify(optionFieldsGe);
          // values["optionsRu"] = JSON.stringify(optionFieldsRu);
          for (let value in values) {
            formData.append(value, values[value]);
          }
          productsAPI
            .addProduct(values)
            .then((data) => {
              setResultMessage("The product added successfully");
              return navigate(`/admin/products/${page}/${sType}`);
            })
            .catch((error) => {
              setResultMessage("Couldn't add product!");
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
              <span className={styles.label}>name(georgian):</span>
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
              <span className={styles.label}>name(russian):</span>
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
              {/* <span className={styles.label}>model:</span>
              <div className={styles.formItem}>
                <input
                  type="input"
                  name="productModel"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.productModel}
                  className={styles.input}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.productModel &&
                  touched.productModel &&
                  errors.productModel}
              </span> */}

              <span className={styles.label}>brand:</span>
              <div className={styles.formItem}>
                <Field
                  as="select"
                  name="productBrand"
                  className={styles.options}
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

              <span className={styles.label}>country(english):</span>
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

              <span className={styles.label}>country(georgian):</span>
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
              <span className={styles.label}>country(russian):</span>
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

              {/* <span className={styles.label}>multi-color:</span>
              <div
                className={styles.formItem}
                style={{
                  textAlign: "left",
                  paddingLeft: "5%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Field type="checkbox" name="productMultyColor" />
              </div>
              <span className={`${styles.label} ${styles.error}`}></span> */}

              {/* <span className={styles.label}>multi-size:</span>
              <div
                className={styles.formItem}
                style={{
                  textAlign: "left",
                  paddingLeft: "5%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Field type="checkbox" name="productMultyDimension" />
              </div>
              <span className={`${styles.label} ${styles.error}`}></span> */}

              {/* <span className={styles.label}>dimension:</span>
              <div className={styles.formItem}>
                <input
                  type="input"
                  name="productDimension"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.productDimension}
                  className={styles.input}
                  disabled={values.productMultyDimension}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}></span>
              <span className={styles.label}>weight:</span>
              <div className={styles.formItem}>
                <input
                  type="input"
                  name="productWeight"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.productWeight}
                  className={styles.input}
                  disabled={values.productMultyDimension}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}></span> */}

              {/* <span className={styles.label}>price: &#8382;</span>
              <div
                className={styles.formItem}
                style={{ textAlign: "left", paddingLeft: "5%" }}
              >
                <input
                  type="input"
                  name="productPrice"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.productPrice}
                  className={styles.input}
                  style={{ width: "140px" }}
                  disabled={values.productMultyDimension}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.productPrice}
              </span> */}

              {/* <span className={styles.label}>discount:</span>
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
                  name="productDiscount"
                  disabled={values.productMultyDimension}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}></span>
              <span className={styles.label}>new price: &#8382;</span>
              <div
                className={styles.formItem}
                style={{ textAlign: "left", paddingLeft: "5%" }}
              >
                <input
                  type="text"
                  name="productNewPrice"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.productNewPrice}
                  className={styles.input}
                  style={{ width: "140px" }}
                  disabled={
                    !values.productDiscount || values.productMultyDimension
                  }
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.productNewPrice}
              </span> */}
              {/* <span className={styles.label}>quantity: &#8382;</span>
              <div
                className={styles.formItem}
                style={{ textAlign: "left", paddingLeft: "5%" }}
              >
                <input
                  type="text"
                  name="productCount"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.productCount}
                  className={styles.input}
                  style={{ width: "140px" }}
                  disabled={values.productMultyDimension}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.productCount}
              </span> */}
              <span className={styles.label}>in stock:</span>
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
              {/* <span className={styles.label}>popular:</span>
              <div
                className={styles.formItem}
                style={{
                  textAlign: "left",
                  paddingLeft: "5%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Field type="checkbox" name="productPopular" />
                
              </div>
              <span className={`${styles.label} ${styles.error}`}></span> */}
              <span className={styles.label}>on top:</span>
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

              {/* <button
                className={styles.btn}
                type="button"
                onClick={addOption}
                style={{ gridColumn: "1 / 4", width: "200px" }}
              >
                add option
              </button>
              <span className={styles.label}>option name(english):</span>
              <span className={styles.label} style={{ textAlign: "center" }}>
                option content(english):
              </span>
              <span className={styles.label}></span>

              {optionFieldsEn.map((inputField, index) => (
                <>
                  <div className={styles.formItem}>
                    <input
                      type="input"
                      value={inputField.optionNameEn}
                      className={styles.input}
                      onChange={(e) => handleOptionCahnge(index, e, "en", "n")}
                    />
                  </div>

                  <div className={styles.formItem}>
                    <input
                      type="input"
                      value={inputField.optionValueEn}
                      className={styles.input}
                      onChange={(e) => handleOptionCahnge(index, e, "en", "v")}
                    />
                  </div>
                  <button
                    type="button"
                    className={styles.btn}
                    onClick={() => removeOption(index)}
                  >
                    delete option
                  </button>
                </>
              ))} */}

              {/* <span className={styles.label}>option name(georgian):</span>
              <span className={styles.label} style={{ textAlign: "center" }}>
                option content(georgian):
              </span>
              <span className={styles.label}></span>

              {optionFieldsGe.map((inputField, index) => (
                <>
                  <div className={styles.formItem}>
                    <input
                      type="input"
                      value={inputField.optionNameGe}
                      className={styles.input}
                      onChange={(e) => handleOptionCahnge(index, e, "ge", "n")}
                    />
                  </div>

                  <div className={styles.formItem}>
                    <input
                      type="input"
                      value={inputField.optionValueGe}
                      className={styles.input}
                      onChange={(e) => handleOptionCahnge(index, e, "ge", "v")}
                    />
                  </div>
                  <span></span>
                </>
              ))} */}

              {/* <span className={styles.label}>option name(russian):</span>
              <span className={styles.label} style={{ textAlign: "center" }}>
                option content(russian):
              </span>
              <span className={styles.label}></span>

              {optionFieldsRu.map((inputField, index) => (
                <>
                  <div className={styles.formItem}>
                    <input
                      type="input"
                      value={inputField.optionNameRu}
                      className={styles.input}
                      onChange={(e) => handleOptionCahnge(index, e, "ru", "n")}
                    />
                  </div>

                  <div className={styles.formItem}>
                    <input
                      type="input"
                      value={inputField.optionValueRu}
                      className={styles.input}
                      onChange={(e) => handleOptionCahnge(index, e, "ru", "v")}
                    />
                  </div>
                  <span></span>
                  <button
                    type="button"
                    className={styles.btn}
                    onClick={(index) => removeOption(index, 2)}
                  >
                    delete option
                  </button>
                </>
              ))} */}
              {/* <span className={styles.label}>image:</span>
              <div className={styles.formItem}>
                <input
                  multiple={true}
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
              </span> */}
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
                    return navigate(`/admin/products/${page}/${sType}`);
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

export default AddProduct;
