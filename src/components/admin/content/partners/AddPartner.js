import { useNavigate, useParams } from "react-router-dom";
import styles from "../Update.module.css";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { createRef, useState } from "react";
import { partnerAPI } from "../../dal/api";
import loadingImg from "../../../../assets/loading.gif";
import RichTextEditor from "../../richtext/richText";
import "draft-js/dist/Draft.css";

const AddPartner = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const refEn = createRef();
  const refGe = createRef();
  const refRu = createRef();

  return (
    <div className={styles.data}>
      {loading && (
        <div className={styles.loadingWrapper}>
          <img src={loadingImg} className={styles.loading} />
        </div>
      )}
      <Formik
        initialValues={{name: "", partnerUrl: "", imgUrl: "" }}
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
          formData.append('contentEn', refEn.current.getContent());
          formData.append('contentGe', refGe.current.getContent());
          formData.append('contentRu', refRu.current.getContent());
          setLoading(true);
          partnerAPI
            .addPartner(formData)
            .then((data) => {
              setResultMessage("The partner data added successfully");
              return navigate("/admin/partners");
            })
            .catch((error) => {
              setResultMessage("Couldn't add partner data!");
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
            <span className={styles.label}>name:</span>
              <div className={styles.formItem}>
                <input
                  type="input"
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  className={styles.input}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}></span>
              <span className={styles.label}>website url:</span>
              <div className={styles.formItem}>
                <input
                  type="input"
                  name="partnerUrl"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.partnerUrl}
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
              <span className={styles.label}>Partner information(english):</span>
              <div className={styles.formItem}>
                <div style={{ width: "90%", margin: "1rem auto" }}>
                  <RichTextEditor name="contentEn" ref={refEn} />
                </div>
              </div>
              <span />
              <span className={styles.label}>Partner information(georgian):</span>
              <div className={styles.formItem}>
                <div style={{ width: "90%", margin: "1rem auto" }}>
                  <RichTextEditor name="contentGe" ref={refGe} />
                </div>
              </div>
              <span />
              <span className={styles.label}>Partner information(russian):</span>
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

export default AddPartner;
