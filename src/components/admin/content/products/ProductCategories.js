import { useEffect, useState } from "react";
import styles from "./Products.module.css";
import { categoryAPI, productsAPI } from "../../dal/api";
import { Link, useNavigate, useParams } from "react-router-dom";
import SplashScreen from "../splashscreen/SplashScreen";

const ProductCategroies = () => {
  const { itemId, page, sType, sTerm } = useParams();
  const navigate = useNavigate();
  const [resultMessage, setResultMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState([]);
  const [productNameEn, setProductNameEn] = useState("");
  const [productModel, setProductModel] = useState("");

  const [resultData, setResultData] = useState([]);

  useEffect(() => {
    getProduct(itemId);
    getCategoriesForProduct();
    getProductCategories(itemId);
  }, []);

  const getProduct = (id) => {
    productsAPI.getProduct(id).then((response) => {
      if (response) {
        setProductNameEn(response.data.data.productNameEn);
        setProductModel(response.data.data.productModel);
      }
    });
  };

  const getCategoriesForProduct = () => {
    categoryAPI.getCategoriesForProduct().then((response) => {
      if (response) {
        setData(response.data.data);
      }
    });
  };

  const getProductCategories = (id) => {
    productsAPI.getProductCategories(id).then((response) => {
      if (response) {
        response.data.data.forEach((el) => {
          setResultData((d) => {
            return [...d, el.categoryId];
          });
        });
      }
      setLoading(false);
    });
  };

  const checkHandle = (e) => {
    const val = parseInt(e.target.name.substring(3));
    if (e.currentTarget.checked) {
      setResultData((data) => [...data, val]);
    } else {
      setResultData((data) => [...data.filter((d) => d != val)]);
    }
  };

  const setProductCategories = () => {
    setLoading(true);
    productsAPI
      .setProductCategories(itemId, resultData)
      .then((data) => {
        setResultMessage("The product updated successfully");
        return navigate(`/admin/products/${page}/${sType}/${sTerm}`);
      })
      .catch((error) => {
        setResultMessage("Couldn't set categories product!");
      });
  };

  return (
    <div className={styles.data}>
      {loading && <SplashScreen />}
      <div className={styles.form}>
        <div style={{ borderRight: "1px solid rgb(81, 81, 81)" }}>
          <div className={styles.label} onClick={() => console.log(resultData)}>
            {productNameEn}
          </div>
          <div className={styles.label}>{productModel}</div>
        </div>

        <div>
          <div className={styles.label} style={{ textAlign: "center" }}>
            categories:
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
                <div
                  key={`d${d.id}`}
                  className={`${styles.itemWrapper} ${styles.checkBoxWrapper}`}
                >
                  <input
                    type="checkbox"
                    onChange={checkHandle}
                    name={`ch_${d.id}`}
                    checked={resultData.includes(d.id) ? true : false}
                    style={{ width: "20px", height: "20px", cursor: "pointer" }}
                  />
                  <span style={{ margin: "10px", textWrap: "nowrap" }}>
                    {d.nameEn}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

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
            <button className={styles.btn} onClick={setProductCategories}>
              save
            </button>
          </div>

          {/* <button
            type="button"
            className={styles.btn}
            onClick={() => {
              return navigate("/admin/products");
            }}
          >
            cancel
          </button> */}
        </div>
        <div className={`${styles.formItem} ${styles.col3}`}>
          {resultMessage}
        </div>
      </div>
    </div>
  );
};

export default ProductCategroies;
