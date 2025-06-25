import { useEffect, useState } from "react";
import styles from "./BrandsForCategories.module.css";
import { brandsAPI, categoryAPI } from "../../../dal/api";
import SplashScreen from "../../splashscreen/SplashScreen";

const BrandsForCategories = ({ categoryId, categoryTitle, closeModal }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [resultData, setResultData] = useState([]);
  const [resultMessage, setResultMessage]=useState('');

  useEffect(() => {
    LoadBrands();
    LoadBrandsForCategory(categoryId);
  }, []);

  const LoadBrands = () => {
    brandsAPI
      .getBrandsAll()
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  };

  const LoadBrandsForCategory = (catId) => {
    categoryAPI
      .getCategoryBrands(catId)
      .then((response) => {
        response.data.data.forEach((el) => {
          setResultData((d) => {
            return [...d, el.brandId];
          });
        });
      })
      .catch((error) => console.log(error))
      .finally(() => {});
  };

    const setCategoryBrands = () => {
      setLoading(true);
      categoryAPI
        .setCategoryBrands(categoryId, resultData)
        .then((data) => {
          closeModal();
        })
        .catch((error) => {
          setResultMessage("Couldn't set brands for category!");
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
  return (
    <div className={styles.block}>
      {loading && <SplashScreen />}
      brands for <span className={styles.title}>{categoryTitle}</span>
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
              {d.brandName}
            </span>
          </div>
        ))}
      </div>
      <div className={styles.btnGroup}>
        <button className={styles.btn} onClick={setCategoryBrands}>
          save
        </button>
        <button className={styles.btn} onClick={closeModal}>
          cancel
        </button>
      </div>
      <div className={styles.error}>
        {resultMessage}
      </div>
    </div>
  );
};

export default BrandsForCategories;
