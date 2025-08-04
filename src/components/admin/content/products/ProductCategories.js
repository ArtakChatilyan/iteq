import { useEffect, useState } from "react";
import styles from "./Categories.module.css";
import { categoryAPI, productsAPI } from "../../dal/api";
import { Link, useNavigate, useParams } from "react-router-dom";
import SplashScreen from "../splashscreen/SplashScreen";
import collapseIcon from "../../../../assets/circleArrow.png";
import { useCollapse } from "react-collapsed";

const ProductCategroies = ({ productId }) => {
  const [resultMessage, setResultMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isExpanded, setExpanded] = useState(false);
  const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded });

  const [data, setData] = useState([]);
  const [resultData, setResultData] = useState([]);

  useEffect(() => {
    getCategoriesForProduct();
    getProductCategories(productId);
  }, []);

  const getCategoriesForProduct = () => {
    categoryAPI.getCategoriesForProduct().then((response) => {
      if (response) {
        setData(
          response.data.data.sort((a, b) => {
            if (a.nameRu < b.nameRu) {
              return -1;
            }
            if (a.nameRu > b.nameRu) {
              return 1;
            }
            return 0;
          })
        );
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
      .setProductCategories(productId, resultData)
      .then((data) => {
        setResultMessage("The product updated successfully");
        hideMessage();
      })
      .catch((error) => {
        setResultMessage("Failed to set categories for product!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const hideMessage = () => {
    setTimeout(() => {
      setResultMessage("");
    }, 3000);
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
        <span>categories:</span>
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

      <div {...getCollapseProps()}>
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
              <span
                style={{ margin: "10px", textWrap: "nowrap" }}
                title={d.nameRu}
              >
                {d.nameRu}
              </span>
            </div>
          ))}
        </div>

        <div className={`${styles.formItem} ${styles.col3}`}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <button className={styles.btn} onClick={setProductCategories}>
              save
            </button>
          </div>
        </div>
        <div className={styles.label}>{resultMessage}</div>
      </div>
    </div>
  );
};

export default ProductCategroies;
