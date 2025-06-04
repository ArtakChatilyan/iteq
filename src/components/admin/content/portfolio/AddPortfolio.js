import { useNavigate, useParams } from "react-router-dom";
import styles from "../Update.module.css";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { createRef, useEffect, useState } from "react";
import { portfolioAPI } from "../../dal/api";
import loadingImg from "../../../../assets/loading.gif";
import * as Yup from "yup";
import RichTextEditor from "../../richtext/richText";
import "draft-js/dist/Draft.css";

const AddPortfolio = () => {
  const navigate = useNavigate();
  const [resultMessage, setResultMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const refEn=createRef();
  const refGe=createRef();
  const refRu=createRef();

  const formValidationSchema = Yup.object().shape({
    titleEn: Yup.string().required("required"),
    titleGe: Yup.string().required("required"),
    titleRu: Yup.string().required("required"),
  });

  return (
    <div className={styles.data}>
      {loading && (
        <div className={styles.loadingWrapper}>
          <img src={loadingImg} className={styles.loading} />
        </div>
      )}
      <Formik
        initialValues={{
          titleEn: "",
          titleGe: "",
          titleRu: "",
          // contentEn: "",
          // contentGe: "",
          // contentRu: "",
        }}
        validationSchema={formValidationSchema}
        onSubmit={(values, { setSubmitting }) => {
          {
            /* replace( /\r?\n/gi, '' ) */
          }
          setLoading(true);
          const formData = new FormData();

          values["contentEn"]=refEn.current.getContent();
          values["contentGe"]=refGe.current.getContent();
          values["contentRu"]=refRu.current.getContent();

          portfolioAPI
            .addPortfolio(values)
            .then((data) => {
              setResultMessage("The product added successfully");
              return navigate("/admin/portfolio");
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
              <span className={styles.label}>title(english):</span>
              <div className={styles.formItem}>
                <input
                  type="input"
                  name="titleEn"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.titleEn}
                  className={styles.input}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.titleEn && touched.titleEn && errors.titleEn}
              </span>
              <span className={styles.label}>title(georgian):</span>
              <div className={styles.formItem}>
                <input
                  type="input"
                  name="titleGe"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.titleGe}
                  className={styles.input}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.titleGe && touched.titleGe && errors.titleGe}
              </span>
              <span className={styles.label}>title(russian):</span>
              <div className={styles.formItem}>
                <input
                  type="input"
                  name="titleRu"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.titleRu}
                  className={styles.input}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.titleRu && touched.titleRu && errors.titleRu}
              </span>

              <span className={styles.label}>content(english):</span>
              <div className={styles.formItem}>
                <div style={{ width: "90%", margin: '1rem auto' }}>
                  <RichTextEditor name="contentEn" ref={refEn}/>
                </div>

                {/* <textarea
                  className={`${styles.input} ${styles.area}`}
                  name="contentEn"
                  value={values.contentEn}
                  onChange={handleChange}
                /> */}
              </div>
              <span className={`${styles.label} ${styles.error}`}></span>
              <span className={styles.label}>content(georgian):</span>
              <div className={styles.formItem}>
              <div style={{ width: "90%", margin: '1rem auto' }}>
                  <RichTextEditor name="contentGe" ref={refGe}/>
                </div>
                {/* <textarea
                  className={`${styles.input} ${styles.area}`}
                  name="contentGe"
                  value={values.contentGe}
                  onChange={handleChange}
                /> */}
              </div>
              <span className={`${styles.label} ${styles.error}`}></span>
              <span className={styles.label}>content(russian):</span>
              <div className={styles.formItem}>
              <div style={{ width: "90%", margin: '1rem auto' }}>
                  <RichTextEditor name="contentRu" ref={refRu}/>
                </div>
                {/* <textarea
                  className={`${styles.input} ${styles.area}`}
                  name="contentRu"
                  value={values.contentRu}
                  onChange={handleChange}
                /> */}
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

export default AddPortfolio;
