import { useNavigate, useParams } from "react-router-dom";
import styles from "../Update.module.css";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { createRef, useEffect, useState } from "react";
import { portfolioAPI } from "../../dal/api";
import loadingImg from "../../../../assets/loading.gif";
import * as Yup from "yup";
import RichTextEditor from "../../richtext/richText";
import "draft-js/dist/Draft.css";
import { stateFromHTML } from "draft-js-import-html";

const EditPortfolio = () => {
  const { itemId } = useParams();

  const navigate = useNavigate();
  const [resultMessage, setResultMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const refEn = createRef();
  const refGe = createRef();
  const refRu = createRef();

  const [titleEn, setTitleEn] = useState("");
  const [titleGe, setTitleGe] = useState("");
  const [titleRu, setTitleRu] = useState("");
  const [contentEn, setContentEn] = useState();
  const [contentGe, setContentGe] = useState();
  const [contentRu, setContentRu] = useState();

  const formValidationSchema = Yup.object().shape({
    titleEn: Yup.string().required("required"),
    titleGe: Yup.string().required("required"),
    titleRu: Yup.string().required("required"),
  });

  useEffect(() => {
    getPortfolio(itemId);
  }, []);

  const getPortfolio = (id) => {
    portfolioAPI.getPortfolio(id).then((response) => {

      if (response.data.data.id) {
        setTitleEn(response.data.data.titleEn);
        setTitleGe(response.data.data.titleGe);
        setTitleRu(response.data.data.titleRu);

        setContentEn(stateFromHTML(response.data.data.contentEn));
        setContentGe(stateFromHTML(response.data.data.contentGe));
        setContentRu(stateFromHTML(response.data.data.contentRu));
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
          titleEn: titleEn,
          titleGe: titleGe,
          titleRu: titleRu,
          // contentEn: contentEn,
          // contentGe: contentGe,
          // contentRu: contentRu,
        }}
        validationSchema={formValidationSchema}
        onSubmit={(values, { setSubmitting }) => {
          setLoading(true);
          values["contentEn"]=refEn.current.getContent();
          values["contentGe"]=refGe.current.getContent();
          values["contentRu"]=refRu.current.getContent();
          //const formData = new FormData();

          // for (let value in values) {
          //   formData.append(value, values[value]);
          // }
          portfolioAPI
            .editPortfolio(itemId, values)
            .then((data) => {
              setResultMessage("Portfolio data updated successfully");
              return navigate("/admin/portfolio");
            })
            .catch((error) => {
              setResultMessage("Couldn't update product!");
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
                <div style={{ width: "90%", margin: "1rem auto" }}>
                  <RichTextEditor
                    name="contentEn"
                    ref={refEn}
                    content={contentEn}
                  />
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
                <div style={{ width: "90%", margin: "1rem auto" }}>
                  <RichTextEditor
                    name="contentGe"
                    ref={refGe}
                    content={contentGe}
                  />
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
                <div style={{ width: "90%", margin: "1rem auto" }}>
                  <RichTextEditor
                    name="contentRu"
                    ref={refRu}
                    content={contentRu}
                  />
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
                  save
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

export default EditPortfolio;
