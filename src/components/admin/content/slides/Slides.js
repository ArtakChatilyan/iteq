import { useEffect, useState } from "react";
import styles from "./Slides.module.css";
import { slidesAPI } from "../../dal/api";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Formik } from "formik";
import loadingImg from "../../../../assets/loading.gif";

const Slides = () => {
  //const { itemId } = useParams();
  const navigate = useNavigate();
  const [resultMessage, setResultMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState([]);
  //const [productNameEn, setProductNameEn] = useState("");
  //const [productModel, setProductModel] = useState("");

  const [resultData, setResultData] = useState([]);
  const [modal, setModal] = useState(false);
  const [deleteId, setDeleteId] = useState(0);

  useEffect(() => {
    getSlides();
  }, []);

  const getSlides = () => {
    slidesAPI.getSlides().then((response) => {
      if (response) {
        setData(response.data.data);
      }
      setLoading(false);
    });
  };

  const deleteItem = (id) => {
    setLoading(true);
    slidesAPI.deleteSlide(id).then((data) => {
      window.location.reload(false);
    });
  };

  return (
    <div className={styles.data}>
      {loading && (
        <div className={styles.loadingWrapper}>
          <img src={loadingImg} className={styles.loading} />
        </div>
      )}
      <div className={styles.form}>
        <div>
          <div
            className={styles.formItem}
            style={{
              display: "flex",
              justifyContent: "center",
              maxHeight: "70vh",
              overflowY: "scroll",
            }}
          >
            <div className={styles.itemContent}>
              {data.map((d) => (
                <div
                  key={`d${d.id}`}
                  className={`${styles.itemWrapper} ${styles.imageWrapper}`}
                >
                  {d.itemType.startsWith("video") ? (
                    <video src={d.itemUrl} style={{ width: "160px" }} />
                  ) : (
                    <img src={d.itemUrl} style={{ width: "160px" }} />
                  )}
                  <button
                    className={styles.btn}
                    onClick={() => {
                      setDeleteId(d.id);
                      setModal(true);
                    }}
                  >
                    delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`${styles.formItem} ${styles.col3}`}>
          {resultMessage}
        </div>
      </div>

      <Formik
        initialValues={{ itemUrl: "" }}
        validate={(values) => {
          const errors = {};
          if (!values.itemUrl) {
            errors.itemUrl = "Required";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setLoading(true);
          const formData = new FormData();
          for (let value in values) {
            formData.append(value, values[value]);
          }
          formData.append("itemType", formData.get("itemUrl").type);
          // for (const [key, value] of formData) {
          //   console.log('»', key, value)
          // }

          // console.log(formData.get("itemUrl").type)
          slidesAPI
            .addSlide(formData)
            .then((data) => {
              console.log(data);

              setResultMessage("The item added successfully");
              window.location.reload();
            })
            .catch((error) => {
              setResultMessage("Couldn't add slideItem!");
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
              <div style={{display: 'flex'}}>
                <span className={styles.label}>image/video:</span>
                <div className={styles.formItem}>
                  <input
                    type="file"
                    name="itemUrl"
                    accept="file_extension|audio/*|video/*|image/*|media_type"
                    onChange={(e) => {
                      setFieldValue("itemUrl", e.currentTarget.files[0]);
                    }}
                    className={styles.input}
                  />
                </div>
              </div>
              <span className={`${styles.label} ${styles.error}`}>
                {errors.itemUrl && touched.itemUrl && errors.itemUrl}
              </span>
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
      {modal && (
        <div className={styles.modal}>
          <div className={styles.btnGroup}>
            <button
              className={styles.delBtn}
              onClick={() => {
                deleteItem(deleteId);
              }}
            >
              delete
            </button>
            <button className={styles.delBtn} onClick={() => setModal(false)}>
              cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Slides;
