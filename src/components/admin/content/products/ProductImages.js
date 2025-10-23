import { useEffect, useRef, useState } from "react";
import styles from "./Products.module.css";
import { productsAPI } from "../../dal/api";
import { Formik } from "formik";
import SplashScreen from "../splashscreen/SplashScreen";
import ModelColorSize from "./ModelColorSize";
import collapseIcon from "../../../../assets/circleArrow.png";
import { useCollapse } from "react-collapsed";
import { useTranslation } from "react-i18next";

const ProductImages = ({ productId }) => {
  const [resultMessage, setResultMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isExpanded, setExpanded] = useState(false);
  const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded });
  const [detailes, setDetailes] = useState(false);
  const { t } = useTranslation();

  const fileInputRef = useRef(null);
  const [images, setImages] = useState([]);

  const [modal, setModal] = useState(false);
  const [deleteId, setDeleteId] = useState(0);

  const [linkedId, setLinkedId] = useState(0);

  useEffect(() => {
    getProductImages(productId);
  }, []);

  const getProductImages = (id) => {
    productsAPI.getProductImages(id).then((response) => {
      if (response) {
        setImages(response.data.data);
      }
      setLoading(false);
    });
  };

  const deleteItem = (id) => {
    setLoading(true);
    productsAPI.deleteImage(id).then((data) => {
      getProductImages(productId);
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
        <span>{t("admin_images")}:</span>
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
      
        <div style={{ backgroundColor: "rgb(32,32,32)" }} {...getCollapseProps()} >
          <div className={styles.dataImages}>
            <Formik
              initialValues={{ imgUrl: "" }}
              validate={(values) => {
                const errors = {};
                if (!values.imgUrl) {
                  errors.imgUrl = t("admin_required");
                }
                return errors;
              }}
              onSubmit={(
                values,
                { setFieldValue, setSubmitting, resetForm }
              ) => {
                setLoading(true);
                const formData = new FormData();
                formData.append("prodId", productId);
                for (let value in values) {
                  formData.append(value, values[value]);
                }

                productsAPI
                  .addProductImage(formData)
                  .then((data) => {
                    setResultMessage(t("admin_imageAddSuccess"));
                    getProductImages(productId);
                    resetForm();
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                    hideMessage();
                  })
                  .catch((error) => {
                    setResultMessage(t("Failed to add image"));
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
                      <span className={styles.label}>{t("admin_image")}:</span>
                      <input
                        type="file"
                        name="imgUrl"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={(e) => {
                          setFieldValue("imgUrl", e.currentTarget.files[0]);
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
                {images.map((d) => (
                  <div
                    key={`im${d.id}`}
                    className={`${styles.itemWrapper} ${styles.imageWrapper}`}
                    style={{backgroundColor: linkedId===d.id ? "rgba(255,255,255,.2)" : "" }}
                  >
                    <img
                      src={d.imgUrl}
                      style={{ width: "120px", cursor: "pointer"}}
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
              <ModelColorSize
                productId={productId}
                imageId={linkedId}
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

export default ProductImages;
