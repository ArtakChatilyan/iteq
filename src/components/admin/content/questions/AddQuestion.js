import { useNavigate, useParams } from "react-router-dom";
import styles from "../Update.module.css";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { newsAPI, partnerAPI, questionsApi } from "../../dal/api";
import SplashScreen from "../splashscreen/SplashScreen";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";

const AddQuestion = () => {
  const { page } = useParams();
  console.log(useParams());
  
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  const formValidationSchema = Yup.object().shape({
    questionEn: Yup.string().required(t("admin_required")),
    questionGe: Yup.string().required(t("admin_required")),
    questionRu: Yup.string().required(t("admin_required")),
    answerEn: Yup.string().required(t("admin_required")),
    answerGe: Yup.string().required(t("admin_required")),
    answerRu: Yup.string().required(t("admin_required")),
  });

  return (
    <div className={styles.data}>
      {loading && <SplashScreen />}
      <Formik
        initialValues={{
          questionEn: "",
          questionGe: "",
          questionRu: "",
          answerEn: "",
          answerGe: "",
          answerRu: "",
        }}
        validationSchema={formValidationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          const formData = new FormData();
          for (let value in values) {
            formData.append(value, values[value]);
          }
          if (
            !values["questionEn"] ||
            !values["questionGe"] ||
            !values["questionRu"] ||
            !values["answerEn"] ||
            !values["answerGe"] ||
            !values["answerRu"]
          )
            throw new Error();
          setLoading(true);
          questionsApi
            .addQuestion(values)
            .then((data) => {
              setResultMessage(t("admin_questionAddSuccess"));
              return navigate(`/admin/questions/${page}`);
            })
            .catch((error) => {
              setResultMessage(t("admin_questionAddFailed"));
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
              <span className={styles.label}>{t("admin_questionEn")}:</span>
              <div className={styles.formItem}>
                <textarea
                  className={`${styles.input} ${styles.areaSmall}`}
                  name="questionEn"
                  value={values.questionEn}
                  onChange={handleChange}
                />
              </div>
              <div className={`${styles.label} ${styles.error}`}>
                {errors.questionEn && touched.questionEn && errors.questionEn}
              </div>
              <span className={styles.label}>{t("admin_answerEn")}:</span>
              <div className={styles.formItem}>
                <textarea
                  className={`${styles.input} ${styles.area}`}
                  name="answerEn"
                  value={values.answerEn}
                  onChange={handleChange}
                />
              </div>
              <div className={`${styles.label} ${styles.error}`}>
                {errors.answerEn && touched.answerEn && errors.answerEn}
              </div>

              <span className={styles.label}>{t("admin_questionGe")}:</span>
              <div className={styles.formItem}>
                <textarea
                  className={`${styles.input} ${styles.areaSmall}`}
                  name="questionGe"
                  value={values.questionGe}
                  onChange={handleChange}
                />
              </div>
              <div className={`${styles.label} ${styles.error}`}>
                {errors.questionGe && touched.questionGe && errors.questionGe}
              </div>
              <span className={styles.label}>{t("admin_answerGe")}:</span>
              <div className={styles.formItem}>
                <textarea
                  className={`${styles.input} ${styles.area}`}
                  name="answerGe"
                  value={values.answerGe}
                  onChange={handleChange}
                />
              </div>
              <div className={`${styles.label} ${styles.error}`}>
                {errors.answerGe && touched.answerGe && errors.answerGe}
              </div>
              <span className={styles.label}>{t("admin_questionRu")}:</span>
              <div className={styles.formItem}>
                <textarea
                  className={`${styles.input} ${styles.areaSmall}`}
                  name="questionRu"
                  value={values.questionRu}
                  onChange={handleChange}
                />
              </div>
              <div className={`${styles.label} ${styles.error}`}>
                {errors.questionRu && touched.questionRu && errors.questionRu}
              </div>
              <span className={styles.label}>{t("admin_answerRu")}:</span>
              <div className={styles.formItem}>
                <textarea
                  className={`${styles.input} ${styles.area}`}
                  name="answerRu"
                  value={values.answerRu}
                  onChange={handleChange}
                />
              </div>
              <div className={`${styles.label} ${styles.error}`}>
                {errors.answerRu && touched.answerRu && errors.answerRu}
              </div>

              <div className={`${styles.formItem} ${styles.col3}`}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.btn}
                >
                  {t("admin_add")}
                </button>
                <button
                  type="button"
                  className={styles.btn}
                  onClick={() => {
                    return navigate(`/admin/questions/${page}`);
                  }}
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

export default AddQuestion;
