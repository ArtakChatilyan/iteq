import styles from "../../Update.module.css";
import { useEffect, useState } from "react";
import { Formik } from "formik";
import SplashScreen from "../../splashscreen/SplashScreen";
import { modelAPI } from "../../../dal/api";
import { useTranslation } from "react-i18next";

const EditModel = ({ modelId, closeModal,reloadModels }) => {
  const [loading, setLoading] = useState(true);
  const [nameEn, setNameEn] = useState("");
  const [nameGe, setNameGe] = useState("");
  const [nameRu, setNameRu] = useState("");
  const [resultMessage, setResultMessage] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    getModel(modelId);
  }, []);

  const getModel = (modelId) => {
    modelAPI
      .getModel(modelId)
      .then((response) => {
        if (response) {
          setNameEn(response.data.model.nameEn);
          setNameGe(response.data.model.nameGe);
          setNameRu(response.data.model.nameRu);
        }
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  };

  return (
    <div className={styles.data}>
      {loading && <SplashScreen />}
      <Formik
        initialValues={{
          nameEn: nameEn,
          nameGe: nameGe,
          nameRu: nameRu,
        }}
        enableReinitialize
        validate={(values) => {
          const errors = {};
          if (!values.nameEn) {
            errors.nameEn = t("admin_required");
          }
          if (!values.nameGe) {
            errors.nameGe = t("admin_required");
          }
          if (!values.nameRu) {
            errors.nameRu = t("admin_required");
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setLoading(true);
          const formData = new FormData();
          for (let value in values) {
            formData.append(value, values[value]);
          }

          modelAPI
            .editModel(modelId, values)
            .then((response) => {
              setResultMessage(t("admin_modelUpdateSuccess"));
              reloadModels();
            })
            .catch((error) => {
              setResultMessage(t("admin_modelUpdateFailed"));
            })
            .finally(() => {
              setLoading(false);
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
              <span className={styles.label}>{t("admin_nameEn")}:</span>
              <div className={styles.formItem}>
                <input
                  type="input"
                  name="nameEn"
                  onChange={(e) => {
                    setNameEn(e.target.value);
                    values.nameEn = e.target.value;
                  }}
                  onBlur={handleBlur}
                  value={values.nameEn}
                  className={styles.input}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.nameEn && touched.nameEn && errors.nameEn}
              </span>
              <span className={styles.label}>{t("admin_nameGe")}:</span>
              <div className={styles.formItem}>
                <input
                  type="input"
                  name="nameGe"
                  onChange={(e) => {
                    setNameGe(e.target.value);
                    values.nameGe = e.target.value;
                  }}
                  onBlur={handleBlur}
                  value={values.nameGe}
                  className={styles.input}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.nameGe && touched.nameGe && errors.nameGe}
              </span>
              <span className={styles.label}>{t("admin_nameRu")}:</span>
              <div className={styles.formItem}>
                <input
                  type="input"
                  name="nameRu"
                  onChange={(e) => {
                    setNameRu(e.target.value);
                    values.nameRu = e.target.value;
                  }}
                  onBlur={handleBlur}
                  value={values.nameRu}
                  className={styles.input}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.nameRu && touched.nameRu && errors.nameRu}
              </span>
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
                  onClick={() => {
                    closeModal();
                  }}
                >
                  {t("admin_close")}
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

export default EditModel;
