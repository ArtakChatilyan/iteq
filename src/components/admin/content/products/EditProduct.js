import { useNavigate, useParams } from "react-router-dom";
import styles from "../Update.module.css";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { brandsAPI, productsAPI } from "../../dal/api";
import SplashScreen from "../splashscreen/SplashScreen";
import * as Yup from "yup";

const EditProduct = () => {
  
  const { itemId, page, sType } = useParams();
  const navigate = useNavigate();
  const [resultMessage, setResultMessage] = useState("");
  const [brandData, setBrandData] = useState([]);
  const [loading, setLoading]=useState(true);

  const [productNameEn, setProductNameEn] = useState("");
  const [productNameGe, setProductNameGe] = useState("");
  const [productNameRu, setProductNameRu] = useState("");
  const [productModel, setProductModel] = useState("");
  const [productBrand, setProductBrand] = useState(0);
  const [productCountryEn, setProductCountryEn] = useState("");
  const [productCountryGe, setProductCountryGe] = useState("");
  const [productCountryRu, setProductCountryRu] = useState("");

  const [productMultyDimension, setProductMultyDimension]=useState("");

  const [productDimension, setProductDimension] = useState("");
  const [productWeight, setProductWeight] = useState("");
  //const [productInfoEn, setProductInfoEn] = useState("");
  //const [productInfoGe, setProductInfoGe] = useState("");
  //const [productInfoRu, setProductInfoRu] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [productDiscount, setProductDiscount] = useState("");
  const [productNewPrice, setProductNewPrice] = useState(0);
  const [productInStock, setProductInStock] = useState("");
  const [productCount, setProductCount]=useState(0);
  //const [productPopular, setProductPopular] = useState(false);
  const [productOnTop, setProductOnTop] = useState("");

  const [optionsEn, setOptionsEn]=useState([]);
  const [optionsGe, setOptionsGe]=useState([]);
  const [optionsRu, setOptionsRu]=useState([]);

  const formValidationSchema = Yup.object().shape({
    productNameEn: Yup.string().required("required"),
    productNameGe: Yup.string().required("required"),
    productNameRu: Yup.string().required("required"),
    productModel: Yup.string().required("required"),
    productPrice: Yup.string().matches(
      /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
      "not valid"
    ),
    productNewPrice: Yup.string().matches(
      /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
      "not valid"
    ),
    productCount: Yup.string().matches(
      /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
      "not valid"
    ),
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

        setProductNameEn(response.data.data.productNameEn);

        setProductNameGe(response.data.data.productNameGe);
        setProductNameRu(response.data.data.productNameRu);
        setProductModel(response.data.data.productModel);
        setProductBrand(response.data.data.productBrand);
        setProductCountryEn(response.data.data.productCountryEn);
        setProductCountryGe(response.data.data.productCountryGe);
        setProductCountryRu(response.data.data.productCountryRu);
        setProductMultyDimension(response.data.data.productMultyDimension);
        setProductDimension(response.data.data.productDimension);
        setProductWeight(response.data.data.productWeight);
        //setProductInfoEn(response.data.data.productInfoEn);
        //setProductInfoGe(response.data.data.productInfoGe);
        //setProductInfoRu(response.data.data.productInfoRu);
        setProductPrice(response.data.data.productPrice);
        setProductDiscount(response.data.data.productDiscount);
        setProductNewPrice(response.data.data.productNewPrice);
        setProductInStock(response.data.data.productInStock);
        setProductCount(response.data.data.productCount);
        //setProductPopular(response.data.data.productPopular);
        setProductOnTop(response.data.data.productOnTop);
        setOptionsEn(JSON.parse(response.data.data.productDescriptionEn));
        setOptionsGe(JSON.parse(response.data.data.productDescriptionGe));
        setOptionsRu(JSON.parse(response.data.data.productDescriptionRu));
      }
      setLoading(false);
    });
  };

  const checkMultyDimensionHandle=(e)=>{
    setProductMultyDimension(e.currentTarget.checked);
  }
  const checkDiscountHandle = (e) => {
    setProductDiscount(e.currentTarget.checked);
  };
  const checkInStockHandle = (e) => {
    setProductInStock(e.currentTarget.checked);
  };
  // const checkPopularHandle = (e) => {
  //   setProductPopular(e.currentTarget.checked);
  // };
  const checkOnTopHandle = (e) => {
    setProductOnTop(e.currentTarget.checked);
  };

  const addOption = () => {
    setOptionsEn([
      ...optionsEn,
      { optionNameEn: "", optionValueEn: "" },
    ]);
    setOptionsGe([
      ...optionsGe,
      { optionNameGe: "", optionValueGe: "" },
    ]);
    setOptionsRu([
      ...optionsRu,
      { optionNameRu: "", optionValueRu: "" },
    ]);
  };

  const removeOption = (index, lang) => {
    const newOptionsEn = [...optionsEn];
    newOptionsEn.splice(index, 1);
    setOptionsEn(newOptionsEn);

    const newOptionsGe = [...optionsGe];
    newOptionsGe.splice(index, 1);
    setOptionsGe(newOptionsGe);

    const newOptionsRu = [...optionsRu];
    newOptionsRu.splice(index, 1);
    setOptionsRu(newOptionsRu);
  };

  const handleOptionCahnge = (index, event, lang, term) => {
    let values;
    switch (lang) {
      case "en":
        values = [...optionsEn];
        if (term === "n") {
          values[index].optionNameEn = event.target.value;
          setOptionsEn(values);
        }else{
          values[index].optionValueEn = event.target.value;
          setOptionsEn(values);
        }
        break;
      case "ge":
        values = [...optionsGe];
        if (term === "n") {
          values[index].optionNameGe = event.target.value;
          setOptionsGe(values);
        }else{
          values[index].optionValueGe = event.target.value;
          setOptionsGe(values);
        }
        break;
      case "ru":
        values = [...optionsRu];
        if (term === "n") {
          values[index].optionNameRu = event.target.value;
          setOptionsRu(values);
        }else{
          values[index].optionValueRu = event.target.value;
          setOptionsRu(values);
        }
        break;
    }
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
          productModel: productModel,
          productBrand: productBrand,
          productCountryEn: productCountryEn,
          productCountryGe: productCountryGe,
          productCountryRu: productCountryRu,
          productMultyDimension: productMultyDimension,
          productDimension: productDimension,
          productWeight: productWeight,
          // productInfoEn: productInfoEn,
          // productInfoGe: productInfoGe,
          // productInfoRu: productInfoRu,
          productPrice: productPrice,
          productDiscount: productDiscount,
          productNewPrice: productNewPrice,
          productInStock: productInStock,
          productCount: productCount,
          //productPopular: productPopular,
          productOnTop: productOnTop,

        }}
        validationSchema={formValidationSchema}
        onSubmit={(values, { setSubmitting }) => {
          setLoading(true);
          const formData = new FormData();
          for (let value in values) {
            formData.append(value, values[value]);
          }
          values["optionsEn"]=JSON.stringify(optionsEn);
          values["optionsGe"]=JSON.stringify(optionsGe);
          values["optionsRu"]=JSON.stringify(optionsRu);
          productsAPI
            .editProduct(values, itemId)
            .then((data) => {
              setResultMessage("The product updated successfully");
              return navigate(`/admin/products/${page}/${sType}`);
            })
            .catch((error) => {
              setResultMessage("Couldn't edit product!");
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
              <span className={styles.label}>name(georgian):</span>
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
              <span className={styles.label}>name(russian):</span>
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
              <span className={styles.label}>model:</span>
              <div className={styles.formItem}>
                <input
                  type="input"
                  name="productModel"
                  onChange={(e) => {
                    setProductModel(e.target.value);
                    values.productModel = e.target.value;
                  }}
                  onBlur={handleBlur}
                  value={values.productModel}
                  className={styles.input}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.productModel &&
                  touched.productModel &&
                  errors.productModel}
              </span>

              <span className={styles.label}>brand:</span>
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
                    <option key={`br${d.id}`} value={d.id}>{d.brandName}</option>
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

              <span className={styles.label}>country(georgian):</span>
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
              <span className={styles.label}>country(russian):</span>
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

              <span className={styles.label}>multi-dimensional:</span>
              <div
                className={styles.formItem}
                style={{
                  textAlign: "left",
                  paddingLeft: "5%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Field type="checkbox" name="productMultyDimension" onChange={checkMultyDimensionHandle}/>
              </div>
              <span className={`${styles.label} ${styles.error}`}></span>

              <span className={styles.label}>dimension:</span>
              <div className={styles.formItem}>
                <input
                  type="input"
                  name="productDimension"
                  onChange={(e) => {
                    setProductDimension(e.target.value);
                    values.productDimension = e.target.value;
                  }}
                  onBlur={handleBlur}
                  value={values.productDimension}
                  className={styles.input}
                  //disabled={values.productMultyDimension}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}></span>
              <span className={styles.label}>weight:</span>
              <div className={styles.formItem}>
                <input
                  type="input"
                  name="productWeight"
                  onChange={(e) => {
                    setProductWeight(e.target.value);
                    values.productWeight = e.target.value;
                  }}
                  onBlur={handleBlur}
                  value={values.productWeight}
                  className={styles.input}
                  //disabled={values.productMultyDimension}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}></span>

              {/* <span className={styles.label}>description(english):</span>
              <div className={styles.formItem}>
                <textarea
                  className={`${styles.input} ${styles.area}`}
                  name="productInfoEn"
                  value={values.productInfoEn}
                  onChange={handleChange}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}></span> */}

              {/* <span className={styles.label}>description(georgian):</span>
              <div className={styles.formItem}>
                <textarea
                  className={`${styles.input} ${styles.area}`}
                  name="productInfoGe"
                  value={values.productInfoGe}
                  onChange={handleChange}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}></span> */}

              {/* <span className={styles.label}>description(russian):</span>
              <div className={styles.formItem}>
                <textarea
                  className={`${styles.input} ${styles.area}`}
                  name="productInfoRu"
                  value={values.productInfoRu}
                  onChange={handleChange}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}></span> */}

              <span className={styles.label}>price: &#8382;</span>
              <div
                className={styles.formItem}
                style={{ textAlign: "left", paddingLeft: "5%" }}
              >
                <input
                  type="input"
                  name="productPrice"
                  onChange={(e) => {
                    setProductPrice(e.target.value);
                    values.productPrice = e.target.value;
                  }}
                  onBlur={handleBlur}
                  value={values.productPrice}
                  className={styles.input}
                  style={{ width: "140px" }}
                  disabled={values.productMultyDimension}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.productPrice}
              </span>

              <span className={styles.label}>discount:</span>
              <div
                className={styles.formItem}
                style={{
                  textAlign: "left",
                  paddingLeft: "5%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Field type="checkbox" name="productDiscount" onChange={checkDiscountHandle} 
                //disabled={values.productMultyDimension}
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
                  onChange={(e) => {
                    setProductNewPrice(e.target.value);
                    values.productNewPrice = e.target.value;
                  }}
                  onBlur={handleBlur}
                  value={values.productNewPrice}
                  className={styles.input}
                  style={{ width: "140px" }}
                  disabled={!values.productDiscount 
                    //|| values.productMultyDimension
                  }
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.productNewPrice}
              </span>
              <span className={styles.label}>quantity: &#8382;</span>
              <div
                className={styles.formItem}
                style={{ textAlign: "left", paddingLeft: "5%" }}
              >
                <input
                  type="text"
                  name="productCount"
                  onChange={(e) => {
                    setProductCount(e.target.value);
                    values.productCount = e.target.value;
                  }}
                  onBlur={handleBlur}
                  value={values.productCount}
                  className={styles.input}
                  style={{ width: "140px" }}
                  //disabled={values.productMultyDimension}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.productCount}
              </span> 
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
                <Field type="checkbox" name="productInStock" onChange={checkInStockHandle}/>
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
                <Field type="checkbox" name="productPopular" onChange={checkPopularHandle}/>
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
                <Field type="checkbox" name="productOnTop" onChange={checkOnTopHandle}/>
              </div>
              <span className={`${styles.label} ${styles.error}`}></span>

              <button
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

              {optionsEn.length>0 && optionsEn.map((inputField, index) => (
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
              ))}

              <span className={styles.label}>option name(georgian):</span>
              <span className={styles.label} style={{ textAlign: "center" }}>
                option content(georgian):
              </span>
              <span className={styles.label}></span>

              {optionsGe.length > 0 && optionsGe.map((inputField, index) => (
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
              ))}

              <span className={styles.label}>option name(russian):</span>
              <span className={styles.label} style={{ textAlign: "center" }}>
                option content(russian):
              </span>
              <span className={styles.label}></span>

              {optionsRu.length>0 && optionsRu.map((inputField, index) => (
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
                  {/* <button
                    type="button"
                    className={styles.btn}
                    onClick={(index) => removeOption(index, 2)}
                  >
                    delete option
                  </button> */}
                </>
              ))}

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
                  onClick={()=>{ return navigate(`/admin/products/${page}/${sType}`);}}
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

export default EditProduct;
