import { useNavigate, useParams } from "react-router-dom";
import styles from "../Update.module.css";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { portfolioAPI } from "../../dal/api";
import loadingImg from "../../../../assets/loading.gif";

const EditOption = () => {
  const { itemId, optionId } = useParams();
  console.log(itemId, optionId);
  
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [resultMessage, setResultMessage] = useState("");
  const [optionEn, setOptionEn] = useState("");
  const [optionGe, setOptionGe] = useState("");
  const [optionRu, setOptionRu] = useState("");

  useEffect(() => {
    getOption(optionId);
  }, []);

  const getOption = (id) => {
    portfolioAPI.getPortfolioOption(id).then((response) => {
      console.log(response.data);
      
      if (response) {
        setOptionEn(response.data.data.optionEn);
        setOptionGe(response.data.data.optionGe);
        setOptionRu(response.data.data.optionRu);
      }
      setLoading(false);
    });
  };

  return (
    <div className={styles.data}>
      {loading && (
        <div className={styles.loadingWrapper}>
          <img src={loadingImg} className={styles.loading} />
        </div>
      )}
      <Formik
      enableReinitialize
        initialValues={{
          optionEn: optionEn,
          optionGe: optionGe,
          optionRu: optionRu,
        }}
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
            .editPortfolioOption(optionId, values)
            .then((data) => {
              setResultMessage("The portfolio option updated successfully");
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
                  edit
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

export default EditOption;
