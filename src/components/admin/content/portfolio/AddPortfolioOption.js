import { useNavigate, useParams } from "react-router-dom";
import styles from "../Update.module.css";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { portfolioAPI } from "../../dal/api";
import loadingImg from "../../../../assets/loading.gif";

const AddPortfolioOption = () => {
  console.log('adding...');
  
  const { itemId } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [resultMessage, setResultMessage] = useState("");
  return (
    <div className={styles.data}>
      {loading && (
        <div className={styles.loadingWrapper}>
          <img src={loadingImg} className={styles.loading} />
        </div>
      )}
      <Formik
        initialValues={{ optionEn: "", optionGe: "", optionRu: "" }}
        validate={(values) => {
          const errors = {};
          if (!values.optionEn) {
            errors.optionEn = "Required";
          }
          if (!values.optionGe) {
            errors.optionGe = "Required";
          }
          if (!values.optionRu) {
            errors.optionRu = "Required";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          console.log(values);

          setLoading(true);
          const formData = new FormData();
          for (let value in values) {
            formData.append(value, values[value]);
          }

          portfolioAPI
            .addPortfolioOptions(itemId, values)
            .then((data) => {
              setResultMessage("The portfolio option added successfully");
              return navigate(`/admin/portfolioOptions/${itemId}`);
            })
            .catch((error) => {
              setResultMessage("Couldn't add option for portfolio!");
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
              <span className={styles.label}>option name(english):</span>
              <div className={styles.formItem}>
                <input
                  type="input"
                  name="optionEn"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.optionEn}
                  className={styles.input}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.optionEn && touched.optionEn && errors.optionEn}
              </span>
              <span className={styles.label}>option name(georgian):</span>
              <div className={styles.formItem}>
                <input
                  type="input"
                  name="optionGe"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.optionGe}
                  className={styles.input}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.optionGe && touched.optionGe && errors.optionGe}
              </span>
              <span className={styles.label}>option name(russian):</span>
              <div className={styles.formItem}>
                <input
                  type="input"
                  name="optionRu"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.optionRu}
                  className={styles.input}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.optionRu && touched.optionRu && errors.optionRu}
              </span>
              <div className={`${styles.formItem} ${styles.col3}`}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.btn}
                >
                  add
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

export default AddPortfolioOption