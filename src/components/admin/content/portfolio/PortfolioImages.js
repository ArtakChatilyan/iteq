import { useEffect, useState } from "react";
import styles from "./Portfolio.module.css";
import {  portfolioAPI } from "../../dal/api";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Formik } from "formik";
import loadingImg from "../../../../assets/loading.gif"

const PortfolioImages = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [resultMessage, setResultMessage] = useState("");
  const [loading, setLoading]=useState(true);

  const [data, setData] = useState([]);
  const [titleEn, setTitleEn] = useState("");

  const [resultData, setResultData] = useState([]);
  const [modal, setModal] = useState(false);
  const [deleteId, setDeleteId] = useState(0);

  useEffect(() => {
    getPortfolio(itemId);
    getPortfolioImages(itemId);
  }, []);

  const getPortfolio = (id) => {
    portfolioAPI.getPortfolio(id).then((data) => {
      if (data) {
        setTitleEn(data.data.data.titleEn);
      }
    });
  };

  const getPortfolioImages = (id) => {
    portfolioAPI.getPortfolioImages(id).then((response) => {
      if (response) {
        setData(response.data.data);
      }
      setLoading(false);
    });
  };

  const deleteItem = (id) => {
    setLoading(true);
    portfolioAPI.deleteImage(id).then((data) => {
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
        <div style={{ borderRight: "1px solid rgb(81, 81, 81)" }}>
          <div className={styles.label} onClick={() => console.log(resultData)}>
            {titleEn}
          </div>
        </div>

        <div>
          <div className={styles.label} style={{ textAlign: "center" }}>
            images:
          </div>
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
                <div key={`d${d.id}`} className={`${styles.itemWrapper} ${styles.imageWrapper}`}>
                  <img src={d.imgUrl} style={{width:'160px'}}/>
                  <button className={styles.btn} onClick={() => {
                      setDeleteId(d.id);
                      setModal(true);
                    }}>delete</button>
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
        initialValues={{ imgUrl: "" }}
        validate={(values) => {
          const errors = {};
          if (!values.imgUrl) {
            errors.imgUrl = "Required";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setLoading(true);
          const formData = new FormData();
          formData.append('portfolioId', itemId);
          for (let value in values) {
            formData.append(value, values[value]);
          }
          portfolioAPI
            .addPortfolioImage(formData)
            .then((data) => {
              setResultMessage("The image added successfully");
              window.location.reload();
            })
            .catch((error) => {
              setResultMessage("Couldn't add image!");
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

export default PortfolioImages;
