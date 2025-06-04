import { useNavigate, useParams } from "react-router-dom";
import styles from "../Update.module.css";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { productsAPI } from "../../dal/api";
import SplashScreen from "../splashscreen/SplashScreen";
import * as Yup from "yup";

const AddProductSize = () => {
  const { id } = useParams();
  
  const navigate = useNavigate();
  const [resultMessage, setResultMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const formValidationSchema = Yup.object().shape({
    dimension: Yup.string().required("required"),
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
        onSubmit={(values, { setSubmitting }) => {
          {
            /* replace( /\r?\n/gi, '' ) */
          }
          setLoading(true);
          const formData = new FormData();
          for (let value in values) {
            formData.append(value, values[value]);
          }
          values["productId"] = id;
          productsAPI
            .addProductSize(values)
            .then((data) => {
              setResultMessage("New product size added successfully");
              return navigate(`/admin/productSizes/${id}`);
            })
            .catch((error) => {
              setResultMessage("Couldn't add product size!");
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
              <span className={styles.label}>weight:</span>
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
              <span className={styles.label}>price:</span>
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
                <Field type="checkbox" name="discount" />
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
              <span className={styles.label}>quantity:</span>
              <div
                className={styles.formItem}
                style={{ textAlign: "left", paddingLeft: "5%" }}
              >
                <input
                  type="input"
                  name="price"
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
                <Field type="checkbox" name="inStock" />
              </div>
              <span className={`${styles.label} ${styles.error}`}></span>
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
                  onClick={()=>{ return navigate(`/admin/productSizes/${id}`);}}
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

export default AddProductSize;
