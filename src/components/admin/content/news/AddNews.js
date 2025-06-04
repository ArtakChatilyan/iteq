import { useNavigate, useParams } from "react-router-dom";
import styles from "../Update.module.css";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { createRef, useState } from "react";
import { newsAPI, partnerAPI } from "../../dal/api";
import RichTextEditor from "../../richtext/richText";
import "draft-js/dist/Draft.css";
import SplashScreen from "../splashscreen/SplashScreen";

const AddNews = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const refEn = createRef();
  const refGe = createRef();
  const refRu = createRef();

  return (
    <div className={styles.data}>
      {loading && <SplashScreen />}
      <Formik
        initialValues={{
          titleEn: "",
          titleGe: "",
          titleRu: "",
          imgUrl: "",
        }}
        validate={(values) => {
          const errors = {};
          if (!values.imgUrl) {
            errors.imgUrl = "Required";
          }

          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          const formData = new FormData();
          for (let value in values) {
            formData.append(value, values[value]);
          }
          formData.append("contentEn", refEn.current.getContent());
          formData.append("contentGe", refGe.current.getContent());
          formData.append("contentRu", refRu.current.getContent());
          setLoading(true);
          newsAPI
            .addNews(formData)
            .then((data) => {
              setResultMessage("The news data added successfully");
              return navigate("/admin/news");
            })
            .catch((error) => {
              setResultMessage("Couldn't add news data!");
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
              <span className={`${styles.label} ${styles.error}`}></span>
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
              <span className={`${styles.label} ${styles.error}`}></span>
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
              <span className={`${styles.label} ${styles.error}`}></span>


              <span className={styles.label}>image:</span>
              <div className={styles.formItem}>
                <input
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
              </span>
              <span className={styles.label}>
                content(english):
              </span>
              <div className={styles.formItem}>
                <div style={{ width: "90%", margin: "1rem auto" }}>
                  <RichTextEditor name="contentEn" ref={refEn} />
                </div>
              </div>
              <span />
              <span className={styles.label}>
                content(georgian):
              </span>
              <div className={styles.formItem}>
                <div style={{ width: "90%", margin: "1rem auto" }}>
                  <RichTextEditor name="contentGe" ref={refGe} />
                </div>
              </div>
              <span />
              <span className={styles.label}>
                content(russian):
              </span>
              <div className={styles.formItem}>
                <div style={{ width: "90%", margin: "1rem auto" }}>
                  <RichTextEditor name="contentRu" ref={refRu} />
                </div>
              </div>
              <span />
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
                  onClick={()=>{ return navigate('/admin/news');}}
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

export default AddNews;
