import { useNavigate, useParams } from "react-router-dom";
import styles from "../../Update.module.css";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { modelAPI, productsAPI } from "../../../dal/api";
import SplashScreen from "../../splashscreen/SplashScreen";
import * as Yup from "yup";

const EditModelSize = ({sizeId, closeModal}) => {
  const navigate = useNavigate();
  const [resultMessage, setResultMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const[dimension, setDimension]=useState("");
  const[weight, setWeight]=useState("");
  const[price, setPrice]=useState("");
  const[discount, setDiscount]=useState("");
  const[newPrice, setNewPrice]=useState("");
  const[count, setCount]=useState("");
  const[inStock, setInStock]=useState("");

  const formValidationSchema = Yup.object().shape({
    
    price: Yup.string().matches(
      /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
      "not valid"
    ),
    newPrice: Yup.string().matches(
      /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
      "not valid"
    ),
    count: Yup.string().matches(
      /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
      "not valid"
    ),
  });

  useEffect(() => {
    getModelSize(sizeId);
  }, []);

  const getModelSize = (id) => {
    modelAPI
      .getSize(id)
      .then((response) => {
        setDimension(response.data.data.dimension);
        setWeight(response.data.data.weight);
        setPrice(response.data.data.price);
        setDiscount(response.data.data.discount);
        setNewPrice(response.data.data.newPrice);
        setCount(response.data.data.count);
        setInStock(response.data.data.inStock);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const checkDiscountHandle=(e)=>{
    setDiscount(e.currentTarget.checked);
  }

  const checkInStockHandle=(e)=>{
    setInStock(e.currentTarget.checked);
  }

  return (
    <div className={styles.data}>
      {loading && <SplashScreen />}
      <Formik
      enableReinitialize
        initialValues={{
          dimension: dimension,
          weight: weight,
          price: price,
          discount: discount,
          newPrice: newPrice,
          count: count,
          inStock: inStock,
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
          values["sizeId"] = sizeId;
          modelAPI
            .editSize(sizeId, values)
            .then((data) => {
              setResultMessage("Model size updated successfully");
              // return navigate(`/admin/productSizes/${itemId}`);
            })
            .catch((error) => {
              setResultMessage("Failed to update product size!");
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
              <span className={styles.label}>dimension:</span>
              <div className={styles.formItem} style={{ textAlign: "left", paddingLeft: "5%" }}>
                <input
                  type="input"
                  name="dimension"
                  onChange={(e) => {
                    setDimension(e.target.value);
                    values.dimension = e.target.value;
                  }}
                  onBlur={handleBlur}
                  value={values.dimension}
                  className={styles.input}
                  style={{ width: "240px" }}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.dimension && touched.dimension && errors.dimension}
              </span>
              <span className={styles.label}>weight:</span>
              <div className={styles.formItem} style={{ textAlign: "left", paddingLeft: "5%" }}>
                <input
                  type="input"
                  name="weight"
                  onChange={(e) => {
                    setWeight(e.target.value);
                    values.weight = e.target.value;
                  }}
                  onBlur={handleBlur}
                  value={values.weight}
                  className={styles.input}
                  style={{ width: "140px" }}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.weight && touched.weight && errors.weight}
              </span>
              <span className={styles.label}>price: &#8382;</span>
              <div className={styles.formItem}
              style={{ textAlign: "left", paddingLeft: "5%" }}>
                <input
                  type="input"
                  name="price"
                  onChange={(e) => {
                    setPrice(e.target.value);
                    values.price = e.target.value;
                  }}
                  onBlur={handleBlur}
                  value={values.price}
                  className={styles.input}
                  style={{ width: "140px" }}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.price && touched.price && errors.price}
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
                <Field type="checkbox" name="discount" onChange={checkDiscountHandle}/>
              </div>
              <span className={`${styles.label} ${styles.error}`}></span>

              <span className={styles.label}>new price: &#8382;</span>
              <div
                className={styles.formItem}
                style={{ textAlign: "left", paddingLeft: "5%" }}
              >
                <input
                  type="text"
                  name="newPrice"
                  onChange={(e) => {
                    setNewPrice(e.target.value);
                    values.newPrice = e.target.value;
                  }}
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
              <span className={styles.label}>quantity:</span>
              <div
                className={styles.formItem}
                style={{ textAlign: "left", paddingLeft: "5%" }}
              >
                <input
                  type="input"
                  name="count"
                  onChange={(e) => {
                    setCount(e.target.value);
                    values.count = e.target.value;
                  }}
                  onBlur={handleBlur}
                  value={values.count}
                  className={styles.input}
                  style={{ width: "140px" }}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.count && touched.count && errors.count}
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
                <Field type="checkbox" name="inStock" onChange={checkInStockHandle}/>
              </div>
              <span className={`${styles.label} ${styles.error}`}></span>
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
                  // onClick={()=>{ return navigate(`/admin/productSizes/${itemId}`);}}
                  onClick={()=>closeModal()}
                >
                  close
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

export default EditModelSize;
