import { useNavigate, useParams } from "react-router-dom";
import styles from "../Update.module.css";
import { useEffect, useState } from "react";
import { Field, Formik } from "formik";
import SplashScreen from "../splashscreen/SplashScreen";
import { colorAPI } from "../../dal/api";

const EditColor = () => {
  const { itemId } = useParams();
  const [loading, setLoading] = useState(true);

  const [nameEn, setNameEn] = useState("");
  const [nameGe, setNameGe] = useState("");
  const [nameRu, setNameRu] = useState("");
  const [iconUrl, setIconUrl] = useState(null);
  const [resultMessage, setResultMessage] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    getColor(itemId);
  }, []);

  const getColor = (id) => {
    colorAPI.getColor(id).then((response) => {
      if (response) {
        setNameEn(response.data.color.nameEn);
        setNameGe(response.data.color.nameGe);
        setNameRu(response.data.color.nameRu);
        setIconUrl(response.data.color.iconUrl);
      }
      setLoading(false);
    });
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
            errors.nameEn = "Required";
          }
          if (!values.nameGe) {
            errors.nameGe = "Required";
          }
          if (!values.nameRu) {
            errors.nameRu = "Required";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setLoading(true);
          const formData = new FormData();
          for (let value in values) {
            formData.append(value, values[value]);
          }
          
          colorAPI
            .editColor(formData, itemId)
            .then((data) => {
              setResultMessage("The color data updateded successfully");
              return navigate("/admin/colors");
            })
            .catch((error) => {
              setResultMessage("Couldn't update color data!");
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
              <span className={styles.label}>name(english):</span>
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
              <span className={styles.label}>name(georgian):</span>
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
              <span className={styles.label}>name(russian):</span>
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
              <div className={styles.formItem}>
                <img src={iconUrl} style={{ width: "200px", margin: "20px" }} />
                <input
                  type="file"
                  name="iconUrl"
                  accept="image/*"
                  onChange={(e) => {
                    setFieldValue("iconUrl", e.currentTarget.files[0]);
                  }}
                  className={styles.input}
                />
              </div>
              <div className={`${styles.formItem} ${styles.col3}`}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.btn}
                >
                  edit
                </button>
                <button
                  type="button"
                  className={styles.btn}
                  onClick={() => {
                    return navigate("/admin/colors");
                  }}
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

export default EditColor;
