import { useEffect, useRef, useState } from "react";
import styles from "./Products.module.css";
import { productsAPI } from "../../dal/api";
import { Formik } from "formik";
import SplashScreen from "../splashscreen/SplashScreen";
import ModelColorSize from "./ModelColorSize";
import collapseIcon from "../../../../assets/circleArrow.png";
import { useCollapse } from "react-collapsed";
import { useTranslation } from "react-i18next";
import ReactPlayer from "react-player";
import MediaColorSize from "./MediaColorSize";

const ProductVideos = ({ productId }) => {
  const [resultMessage, setResultMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isExpanded, setExpanded] = useState(false);
  const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded });
  const [detailes, setDetailes] = useState(false);
  const { t } = useTranslation();

  const fileInputRef = useRef(null);
  const [videos, setVideos] = useState([]);

  const [modal, setModal] = useState(false);
  const [deleteId, setDeleteId] = useState(0);

  const [linkedId, setLinkedId] = useState(0);

  useEffect(() => {
    getProductVideos(productId);
  }, []);

  const getProductVideos = (id) => {
    productsAPI.getProductMedias(id).then((response) => {
      if (response) {
        setVideos(response.data.data);
      }
      setLoading(false);
    });
  };

  const deleteItem = (id) => {
    setLoading(true);
    productsAPI.deleteMedia(id).then((data) => {
      getProductVideos(productId);
      setModal(false);
    });
  };

  const hideMessage = () => {
    setTimeout(() => {
      setResultMessage("");
    }, 2000);
  };

  return (
    <div className={styles.data}>
      {loading && <SplashScreen />}
      <div
        className={styles.label}
        style={{
          display: "flex",
          alignContent: "center",
          justifyContent: "space-between",
          padding: "1rem 1rem",
        }}
      >
        <span>{t("admin_videos")}:</span>
        <img
          src={collapseIcon}
          style={{
            display: "inline-block",
            width: "28px",
            cursor: "pointer",
            transform: isExpanded ? "rotate(90deg)" : "",
          }}
          {...getToggleProps({
            onClick: () => setExpanded((prevExpanded) => !prevExpanded),
          })}
        />
      </div>

      <div style={{ backgroundColor: "rgb(32,32,32)" }} {...getCollapseProps()}>
        <div className={styles.dataImages}>
          <Formik
            initialValues={{ mediaUrl: "" }}
            validate={(values) => {
              const errors = {};
              if (!values.mediaUrl) {
                errors.mediaUrl = t("admin_required");
              }
              return errors;
            }}
            onSubmit={(values, { setFieldValue, setSubmitting, resetForm }) => {
              setLoading(true);
              const formData = new FormData();
              formData.append("prodId", productId);
              for (let value in values) {
                formData.append(value, values[value]);
              }

              productsAPI
                .addProductMedia(formData)
                .then((data) => {
                  setResultMessage(t("admin_videoAddSuccess"));
                  getProductVideos(productId);
                  resetForm();
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                  hideMessage();
                })
                .catch((error) => {
                  setResultMessage(t("admin_videoAddFailed"));
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
                  <div className={styles.formItem}>
                    <span className={styles.label}>{t("admin_video")}:</span>
                    <input
                      type="file"
                      name="mediaUrl"
                      accept="video/*"
                      ref={fileInputRef}
                      onChange={(e) => {
                        setFieldValue("mediaUrl", e.currentTarget.files[0]);
                      }}
                      className={styles.input}
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={styles.btn}
                    >
                      {t("admin_add")}
                    </button>
                  </div>
                  <span
                    className={`${styles.label} ${styles.error}`}
                    style={{ display: errors ? "inline-block" : "none" }}
                  >
                    {errors.imgUrl && touched.imgUrl && errors.imgUrl}
                  </span>
                  <div
                    className={styles.formItem}
                    style={{
                      display: resultMessage ? "inline-block" : "none",
                    }}
                  >
                    {resultMessage}
                  </div>
                </div>
              </form>
            )}
          </Formik>
          <div className={styles.form}>
            <div className={styles.itemContent}>
              {videos.map((d) => (
                <div
                  key={`im${d.id}`}
                  className={`${styles.itemWrapper} ${styles.imageWrapper}`}
                  style={{
                    backgroundColor:
                      linkedId === d.id ? "rgba(255,255,255,.2)" : "",
                  }}
                >
                  <ReactPlayer
                  controls={true}
                    style={{ width: "120px", cursor: "pointer" }}
                    src={d.mediaUrl}
                    onClick={() => {
                      setLinkedId(d.id);
                      setDetailes(true);
                    }}
                  />
                  <button
                    className={styles.btn}
                    onClick={() => {
                      setDeleteId(d.id);
                      setModal(true);
                    }}
                  >
                    {t("admin_delete")}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {modal && (
            <div className={styles.modal}>
              <div className={styles.btnGroup}>
                <button
                  className={styles.delBtn}
                  onClick={() => {
                    deleteItem(deleteId);
                  }}
                >
                  {t("admin_delete")}
                </button>
                <button
                  className={styles.delBtn}
                  onClick={() => setModal(false)}
                >
                  {t("admin_cancel")}
                </button>
              </div>
            </div>
          )}
        </div>
        {detailes && (
          <div className={styles.detailes}>
            <MediaColorSize
              productId={productId}
              mediaId={linkedId}
              closeModal={() => {
                setDetailes(false);
                setLinkedId(0);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductVideos;
