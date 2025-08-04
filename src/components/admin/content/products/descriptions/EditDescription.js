import styles from "./../Products.module.css";
import { Formik } from "formik";
import SplashScreen from "../../splashscreen/SplashScreen";
import { productsAPI } from "../../../dal/api";
import { useEffect, useState } from "react";

const EditDescription = ({ descriptionId, closeModal, editDescription }) => {
  const [loading, setLoading] = useState(true);
  const [resultMessage, setResultMessage] = useState("");
  const [name, setName] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionGe, setDescriptionGe] = useState("");
  const [descriptionRu, setDescriptionRu] = useState("");

  useEffect(() => {
    getDescription(descriptionId);
  }, []);

  const getDescription = (descriptionId) => {
    productsAPI
      .getDescription(descriptionId)
      .then((response) => {
        setName(response.data.description.name);
        setDescriptionEn(response.data.description.descriptionEn);
        setDescriptionGe(response.data.description.descriptionGe);
        setDescriptionRu(response.data.description.descriptionRu);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      {loading && <SplashScreen />}
      <Formik
        initialValues={{
          name: name,
          descriptionEn: descriptionEn,
          descriptionGe: descriptionGe,
          descriptionRu: descriptionRu,
        }}
        enableReinitialize
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setLoading(true);
          const formData = new FormData();
          for (let value in values) {
            formData.append(value, values[value]);
          }
          values["descriptionId"] = descriptionId;
          productsAPI
            .updateDescription(descriptionId, values)
            .then((data) => {
              setResultMessage("Description updated successfully");
              editDescription();
            })
            .catch((error) => {
              setResultMessage("Failed to update description!");
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
              <span className={styles.label}>description name:</span>
              <div className={styles.formItem}>
                <input
                  type="input"
                  className={styles.input}
                  name="name"
                  value={values.name}
                  onChange={(e) => {
                    setName(e.target.value);
                    values.name = e.target.value;
                  }}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.descriptionEn &&
                  touched.descriptionEn &&
                  errors.descriptionEn}
              </span>
              <span className={styles.label}>description(english):</span>
              <div className={styles.formItem}>
                <textarea
                  className={`${styles.input} ${styles.area}`}
                  name="descriptionEn"
                  value={values.descriptionEn}
                  onChange={(e) => {
                    setDescriptionEn(e.target.value);
                    values.descriptionEn = e.target.value;
                  }}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.descriptionEn &&
                  touched.descriptionEn &&
                  errors.descriptionEn}
              </span>
              <span className={styles.label}>description(georgian):</span>
              <div className={styles.formItem}>
                <textarea
                  className={`${styles.input} ${styles.area}`}
                  name="descriptionGe"
                  value={values.descriptionGe}
                  onChange={(e) => {
                    setDescriptionGe(e.target.value);
                    values.descriptionGe = e.target.value;
                  }}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.descriptionGe &&
                  touched.descriptionGe &&
                  errors.descriptionGe}
              </span>
              <span className={styles.label}>description(russian):</span>
              <div className={styles.formItem}>
                <textarea
                  className={`${styles.input} ${styles.area}`}
                  name="descriptionRu"
                  value={values.descriptionRu}
                  onChange={(e) => {
                    setDescriptionRu(e.target.value);
                    values.descriptionRu = e.target.value;
                  }}
                />
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.descriptionRu &&
                  touched.descriptionRu &&
                  errors.descriptionRu}
              </span>
              <div className={`${styles.formItem} ${styles.col3}`}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.btn}
                >
                  save
                </button>
                <button
                  type="button"
                  className={styles.btn}
                  onClick={() => closeModal()}
                >
                  close
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

export default EditDescription;
