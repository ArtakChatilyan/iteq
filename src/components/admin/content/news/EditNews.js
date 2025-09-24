import { useNavigate, useParams } from "react-router-dom";
import styles from "../Update.module.css";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { createRef, useEffect, useState } from "react";
import { newsAPI, partnerAPI } from "../../dal/api";
import RichTextEditor from "../../richtext/richText";
import "draft-js/dist/Draft.css";
import { stateFromHTML } from "draft-js-import-html";
import SplashScreen from "../splashscreen/SplashScreen";
import { useTranslation } from "react-i18next";

const EditPartner = () => {
  const { t } = useTranslation();
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const refEn = createRef();
  const refGe = createRef();
  const refRu = createRef();

  const [titleEn, setTitleEn] = useState("");
  const [titleGe, setTitleGe] = useState("");
  const [titleRu, setTitleRu] = useState("");
  const [contentEn, setContentEn] = useState();
  const [contentGe, setContentGe] = useState();
  const [contentRu, setContentRu] = useState();
  const [imgUrl, setImgUrl] = useState(null);

  useEffect(() => {
    getNewsById(itemId);
  }, []);

  const getNewsById = (id) => {
    newsAPI.getNewsById(id).then((response) => {
        
      if (response.data.data.id) {
        setTitleEn(response.data.data.titleEn);
        setTitleGe(response.data.data.titleGe);
        setTitleRu(response.data.data.titleRu);
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
      {loading && <SplashScreen />}
      <Formik
      enableReinitialize
        initialValues={{titleEn: titleEn, titleGe: titleGe,titleRu: titleRu, imgUrl: imgUrl }}
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
          newsAPI
            .editNews(formData, itemId)
            .then((data, itemId) => {
              setResultMessage(t("admin_newsUpdateSuccess"));
              return navigate("/admin/news");
            })
            .catch((error) => {
              setResultMessage(t("admin_newsUpdateFailed"));
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
            <span className={styles.label}>{t("admin_titleEn")}:</span>
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
              <span className={styles.label}>{t("admin_titleGe")}:</span>
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
              <span className={styles.label}>{t("admin_titleRu")}:</span>
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


              <span className={styles.label}>{t("admin_image")}:</span>
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
                {t("admin_contentEn")}:
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
                {t("admin_contentGe")}:
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
                {t("admin_contentRu")}:
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
                  {t("admin_edit")}
                </button>
                <button
                  type="button"
                  className={styles.btn}
                  onClick={()=>{ return navigate('/admin/news');}}
                >
                  {t("admin_cancel")}
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
