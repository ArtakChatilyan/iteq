import { useNavigate, useParams } from "react-router-dom";
import styles from "../Update.module.css";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { createRef, useEffect, useState } from "react";
import { partnerAPI } from "../../dal/api";
import loadingImg from "../../../../assets/loading.gif";
import RichTextEditor from "../../richtext/richText";
import "draft-js/dist/Draft.css";
import { stateFromHTML } from "draft-js-import-html";

const EditPartner = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const refEn = createRef();
  const refGe = createRef();
  const refRu = createRef();

  const [name, setName] = useState("");
  const [partnerUrl, setPartnerUrl] = useState("");
  const [contentEn, setContentEn] = useState();
  const [contentGe, setContentGe] = useState();
  const [contentRu, setContentRu] = useState();
  const [imgUrl, setImgUrl] = useState(null);

  useEffect(() => {
    getPartner(itemId);
  }, []);

  const getPartner = (id) => {
    partnerAPI.getPartner(id).then((response) => {
        
      if (response.data.data.id) {
        setName(response.data.data.name);
        setPartnerUrl(response.data.data.partnerUrl);
        setImgUrl(response.data.data.imgUrl);

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
        initialValues={{name: name, partnerUrl: partnerUrl, imgUrl: imgUrl }}
        validate={(values) => {
          const errors = {};
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
          partnerAPI
            .editPartner(formData, itemId)
            .then((data, itemId) => {
              setResultMessage("The partner data updated successfully");
              return navigate("/admin/partners");
            })
            .catch((error) => {
              setResultMessage("Couldn't update partner data!");
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
                <img src={imgUrl} style={{ width: "200px", margin: "20px" }} />
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
                Partner information(english):
              </span>
              <div className={styles.formItem}>
                <div style={{ width: "90%", margin: "1rem auto" }}>
                  <RichTextEditor
                    name="contentEn"
                    ref={refEn}
                    content={contentEn}
                  />
                </div>
              </div>
              <span />
              <span className={styles.label}>
                Partner information(georgian):
              </span>
              <div className={styles.formItem}>
                <div style={{ width: "90%", margin: "1rem auto" }}>
                  <RichTextEditor
                    name="contentGe"
                    ref={refGe}
                    content={contentGe}
                  />
                </div>
              </div>
              <span />
              <span className={styles.label}>
                Partner information(russian):
              </span>
              <div className={styles.formItem}>
                <div style={{ width: "90%", margin: "1rem auto" }}>
                  <RichTextEditor
                    name="contentRu"
                    ref={refRu}
                    content={contentRu}
                  />
                </div>
              </div>
              <span />
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

export default EditPartner;
