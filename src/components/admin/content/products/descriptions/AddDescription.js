import styles from "./../Products.module.css";
import { Formik } from "formik";
import SplashScreen from "../../splashscreen/SplashScreen";
import { productsAPI } from "../../../dal/api";
import { useState } from "react";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";

const AddDescription = ({ productId, closeModal, addDescription }) => {
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const { t } = useTranslation();

  const formValidationSchema = Yup.object().shape({
    descriptionName: Yup.string().required(t("admin_required")),
    descriptionEn: Yup.string().required(t("admin_required")),
    descriptionGe: Yup.string().required(t("admin_required")),
    descriptionRu: Yup.string().required(t("admin_required")),
  });
  return (
    <div>
      {loading && <SplashScreen />}
      <Formik
        initialValues={{
          descriptionName: "",
          descriptionEn: "",
          descriptionGe: "",
          descriptionRu: "",
        }}
        validationSchema={formValidationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setLoading(true);
          const formData = new FormData();
          for (let value in values) {
            formData.append(value, values[value]);
          }
          values["productId"] = productId;
          if (
            !values["descriptionName"] ||
            !values["descriptionName"] ||
            !values["descriptionName"] ||
            !values["descriptionName"]
          )
            throw new Error();
          productsAPI
            .addDescription(values)
            .then((data) => {
              setResultMessage(t("admin_descriptionAddedSuccessfully"));
              resetForm();
              addDescription();
            })
            .catch((error) => {
              setResultMessage(t("admin_failedAddDescription"));
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
            <div className={styles.form} style={{ textAlign: "left" }}>
              <span className={styles.label}>{t("admin_descriptionName")}:</span>
              <div className={styles.formItem}>
                <input
                  className={styles.input}
                  name="descriptionName"
                  value={values.descriptionName}
                  onChange={handleChange}
                />
                <div className={`${styles.label} ${styles.error}`}>
                  {errors.descriptionEn &&
                    touched.descriptionEn &&
                    errors.descriptionEn}
                </div>
              </div>

              <span className={styles.label}>{t("admin_descriptionEn")}:</span>
              <div className={styles.formItem}>
                <textarea
                  className={`${styles.input} ${styles.area}`}
                  name="descriptionEn"
                  value={values.descriptionEn}
                  onChange={handleChange}
                />
                <div className={`${styles.label} ${styles.error}`}>
                  {errors.descriptionEn &&
                    touched.descriptionEn &&
                    errors.descriptionEn}
                </div>
              </div>

              <span className={styles.label}>{t("admin_descriptionGe")}:</span>
              <div className={styles.formItem}>
                <textarea
                  className={`${styles.input} ${styles.area}`}
                  name="descriptionGe"
                  value={values.descriptionGe}
                  onChange={handleChange}
                />
                <div className={`${styles.label} ${styles.error}`}>
                  {errors.descriptionGe &&
                    touched.descriptionGe &&
                    errors.descriptionGe}
                </div>
              </div>

              <span className={styles.label}>{t("admin_descriptionRu")}:</span>
              <div className={styles.formItem}>
                <textarea
                  className={`${styles.input} ${styles.area}`}
                  name="descriptionRu"
                  value={values.descriptionRu}
                  onChange={handleChange}
                />
                <div className={`${styles.label} ${styles.error}`}>
                  {errors.descriptionRu &&
                    touched.descriptionRu &&
                    errors.descriptionRu}
                </div>
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
                  onClick={() => closeModal()}
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

export default AddDescription;
