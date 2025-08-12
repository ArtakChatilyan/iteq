import { useNavigate, useParams } from "react-router-dom";
import styles from "../Update.module.css";
import { useEffect, useState } from "react";
import { subcategoryAPI } from "../../dal/api";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import SplashScreen from "../splashscreen/SplashScreen";

const EditSubCategory = () => {
  const { itemId } = useParams();
  const [loading, setLoading]=useState(true);

  const [parentId, setParentId] = useState(0);
  const [nameEn, setNameEn] = useState("");
  const [nameGe, setNameGe] = useState("");
  const [nameRu, setNameRu] = useState("");
  const [categoryOrder, setCategoryOrder]=useState(0);
  const [onTop, setOnTop] = useState(false);
  const formValidationSchema = Yup.object().shape({
        categoryOrder: Yup.string().matches(
          /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
          "not valid"
        ),
        nameEn: Yup.string().required("required"),
        nameGe: Yup.string().required("required"),
        nameRu: Yup.string().required("required"),
      });

  const navigate = useNavigate();
  useEffect(() => {
    getSubCategory(itemId);
  }, []);

  const getSubCategory = (id) => {
    subcategoryAPI.getSubCategory(id).then((response) => {
      if (response) {
        setNameEn(response.data.data.nameEn);
        setNameGe(response.data.data.nameGe);
        setNameRu(response.data.data.nameRu);
        setCategoryOrder(response.data.data.categoryOrder);
        setParentId(response.data.data.parentId);
        setOnTop(response.data.data.onTop);
      }
      setLoading(false);
    });
  };

  const checkHandle = (e) => {
    setOnTop(e.currentTarget.checked);
  };


  const [resultMessage, setResultMessage] = useState("");
  return (
    <div className={styles.data}>
      {loading && <SplashScreen />}
      <Formik
        initialValues={{
          nameEn: nameEn,
          nameGe: nameGe,
          nameRu: nameRu,
          categoryOrder:categoryOrder,
          onTop: onTop
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

          subcategoryAPI
            .editSubCategory(values, itemId)
            .then((data) => {
              setResultMessage("The sub category updateded successfully");
              return navigate(`/admin/subCategories/${parentId}`);
            })
            .catch((error) => {
              setResultMessage("Couldn't update sub category!");
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
                  onChange={(e) => {
                    setNameGe(e.target.value);
                    values.nameGe = e.target.value;
                  }}
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
                  onChange={(e) => {
                    setNameRu(e.target.value);
                    values.nameRu = e.target.value;
                  }}
                  onBlur={handleBlur}
                  value={values.nameRu}
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
                <Field onChange={checkHandle}
                  type="checkbox"
                  name="onTop"
                  style={{ width: "20px", height: "20px", cursor: "pointer" }}
                />
                {/* <input
                  type="checkbox"
                  name="productDiscount"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.productDiscount}
                  className={styles.input}
                  style={{ width: "20px" }}
                /> */}
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
                  onClick={()=>{ return navigate(`/admin/subCategories/${parentId}`);}}
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

export default EditSubCategory;
