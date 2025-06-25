import { useEffect, useState } from "react";
import styles from "./Products.module.css";
import { categoryAPI, colorAPI, productsAPI } from "../../dal/api";
import { Link, useNavigate, useParams } from "react-router-dom";
import SplashScreen from "../splashscreen/SplashScreen";

const ProductColors = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [resultMessage, setResultMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [colors, setColors] = useState([]);
  const [productNameEn, setProductNameEn] = useState("");
  const [productModel, setProductModel] = useState("");

  const [resultData, setResultData] = useState([]);

  useEffect(() => {
    getProduct(itemId);
    getColorsForProduct();
    getProductColors(itemId);
  }, []);

  const getProduct = (id) => {
    productsAPI.getProduct(id).then((response) => {
      if (response) {
        setProductNameEn(response.data.data.productNameEn);
        setProductModel(response.data.data.productModel);
      }
    });
  };

  const getColorsForProduct = () => {
    colorAPI.getColors().then((response) => {
      if (response) {
        setColors(response.data.colors);
      }
    });
  };

  const getProductColors = (id) => {
    productsAPI.getProductColors(id).then((response) => {
      if (response) {
        response.data.pColors.forEach((el) => {
          setResultData((d) => {
            return [...d, el.colorId];
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

  const setProductColors = () => {
    setLoading(true);
    productsAPI
      .setProductColors(itemId, resultData)
      .then(response => {
        setResultMessage("The product updated successfully");
        return navigate("/admin/products");
      })
      .catch((error) => {
        setResultMessage("Couldn't set colors product!")
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
              {colors.map((c) => (
                <div
                  key={`d${c.id}`}
                  className={`${styles.itemWrapper} ${styles.checkBoxWrapper}`}
                >
                  <input
                    type="checkbox"
                    onChange={checkHandle}
                    name={`ch_${c.id}`}
                    checked={resultData.includes(c.id) ? true : false}
                    style={{ width: "20px", height: "20px", cursor: "pointer" }}
                  />
                  <span style={{ margin: "10px", textWrap: "nowrap" }}>
                    {c.nameRu}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`${styles.formItem} ${styles.col3}`}>
          <button className={styles.btn} onClick={setProductColors}>
            save
          </button>
          <button
            type="button"
            className={styles.btn}
            onClick={() => {
              return navigate("/admin/products");
            }}
          >
            cancel
          </button>
        </div>
        <div className={`${styles.formItem} ${styles.col3}`}>
          {resultMessage}
        </div>
      </div>
    </div>
  );
};

export default ProductColors;
