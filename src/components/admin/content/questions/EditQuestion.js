import { useNavigate, useParams } from "react-router-dom";
import styles from "../Update.module.css";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { newsAPI, partnerAPI, questionsApi } from "../../dal/api";
import SplashScreen from "../splashscreen/SplashScreen";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";

const EditQuestion = () => {
  const { itemId, page } = useParams();

  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  const [questionEn, setQuestionEn] = useState("");
  const [questionGe, setQuestionGe] = useState("");
  const [questionRu, setQuestionRu] = useState("");
  const [answerEn, setAnswerEn] = useState("");
  const [answerGe, setAnswerGe] = useState("");
  const [answerRu, setAnswerRu] = useState("");

  const formValidationSchema = Yup.object().shape({
    questionEn: Yup.string().required(t("admin_required")),
    questionGe: Yup.string().required(t("admin_required")),
    questionRu: Yup.string().required(t("admin_required")),
    answerEn: Yup.string().required(t("admin_required")),
    answerGe: Yup.string().required(t("admin_required")),
    answerRu: Yup.string().required(t("admin_required")),
  });

  useEffect(() => {
    getQuestion(itemId);
  }, []);

  const getQuestion = (questionId) => {
    questionsApi
      .getQuestionById(questionId)
      .then((response) => {
        setQuestionEn(response.data.question.questionEn);
        setQuestionGe(response.data.question.questionGe);
        setQuestionRu(response.data.question.questionRu);

        setAnswerEn(response.data.question.answerEn);
        setAnswerGe(response.data.question.answerGe);
        setAnswerRu(response.data.question.answerRu);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className={styles.data}>
      {loading && <SplashScreen />}
      <Formik
        initialValues={{
          questionEn: questionEn,
          questionGe: questionGe,
          questionRu: questionRu,
          answerEn: answerEn,
          answerGe: answerGe,
          answerRu: answerRu,
        }}
        enableReinitialize
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
            .editQuestion(values, itemId)
            .then((data) => {
              setResultMessage(t("admin_questionUpdateSuccess"));
              return navigate(`/admin/questions/${page}`);
            })
            .catch((error) => {
              setResultMessage(t("admin_questionUpdateFailed"));
            })
            .finally(() => setLoading(false));
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
                  onChange={(e) => {
                    setQuestionEn(e.target.value);
                    values.questionEn = e.target.value;
                  }}
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
                  onChange={(e) => {
                    setAnswerEn(e.target.value);
                    values.answerEn = e.target.value;
                  }}
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
                  onChange={(e) => {
                    setQuestionGe(e.target.value);
                    values.questionGe = e.target.value;
                  }}
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
                  onChange={(e) => {
                    setAnswerGe(e.target.value);
                    values.answerGe = e.target.value;
                  }}
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
                  onChange={(e) => {
                    setQuestionRu(e.target.value);
                    values.questionRu = e.target.value;
                  }}
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
                  onChange={(e) => {
                    setAnswerRu(e.target.value);
                    values.answerRu = e.target.value;
                  }}
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
                   {t("admin_save")}
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

export default EditQuestion;
