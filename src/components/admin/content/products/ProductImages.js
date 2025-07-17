import { useEffect, useState } from "react";
import styles from "./Products.module.css";
import { productsAPI } from "../../dal/api";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Formik } from "formik";
import Modal from "react-modal";
import SplashScreen from "../splashscreen/SplashScreen";
import ColorSize from "./ModelColorSize";
import ModelColorSize from "./ModelColorSize";

const ProductImages = () => {
  const { itemId, page, sType, sTerm} = useParams();
  const navigate = useNavigate();
  const [resultMessage, setResultMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [images, setImages] = useState([]);
  const [product, setProduct] = useState(null);
  //const [multyType, setMultyType] = useState(false);
  // const [productNameEn, setProductNameEn] = useState("");
  // const [productModel, setProductModel] = useState("");

  const [resultData, setResultData] = useState([]);
  const [modal, setModal] = useState(false);
  const [deleteId, setDeleteId] = useState(0);

  const [linkedId, setLinkedId] = useState(0);
  const [modalColorSize, setModalColorSize] = useState(false);
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  Modal.setAppElement("#root");

  useEffect(() => {
    getProduct(itemId);
    getProductImages(itemId);
  }, []);

  const getProduct = (id) => {
    productsAPI.getProduct(id).then((response) => {
      if (response) {
        setProduct(response.data.data);
        // if (
        //   response.data.data.productMultyColor ||
        //   response.data.data.productMultyDimension
        // )
        //   setMultyType(true);
        // setProductNameEn(response.data.data.productNameEn);
        // setProductModel(response.data.data.productModel);
      }
    });
  };

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
      window.location.reload(false);
    });
  };

  return (
    <div className={styles.data}>
      {loading && <SplashScreen />}
      <div className={styles.form}>
        <div style={{ borderRight: "1px solid rgb(81, 81, 81)" }}>
          <div className={styles.label} onClick={() => console.log(resultData)}>
            {product && product.productNameEn}
          </div>
          <div className={styles.label}>{product && product.productModel}</div>
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
              {images.map((d) => (
                <div
                  key={`im${d.id}`}
                  className={`${styles.itemWrapper} ${styles.imageWrapper}`}
                >
                  <img src={d.imgUrl} style={{ width: "160px" }} />
                 
                    <button
                      className={styles.linkBtn}
                      onClick={() => {
                        setLinkedId(d.id);
                        setModalColorSize(true);
                      }}
                    >
                      model-color-size
                    </button>
                  

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
          formData.append("prodId", itemId);
          for (let value in values) {
            formData.append(value, values[value]);
          }
          productsAPI
            .addProductImage(formData)
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
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <Link
                    to={`/admin/products/${page}/${sType}/${sTerm}`}
                    style={{
                      textDecoration: "underline",
                      color: "#7dacee",
                      margin: "0 4rem 0 2rem",
                    }}
                  >
                    back
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={styles.btn}
                  >
                    add
                  </button>
                </div>
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
      <Modal
        isOpen={modalColorSize}
        style={{
          overlay: {
            backgroundColor: "rgba(255,255,255,.8)",
          },
          content: {
            color: "lightsteelblue",
            backgroundColor: "rgb(32,32,32)",
          },
        }}
      >
        <ModelColorSize
          productId={itemId}
          imageId={linkedId}
          product={product}
          closeModal={() => {
            setModalColorSize(false);
          }}
        />
      </Modal>
    </div>
  );
};

export default ProductImages;
