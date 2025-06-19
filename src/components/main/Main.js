import ProductMenu from "../productMenu/ProductMenu";
import CategoryMenu from "../categoryMenu/CategoryMenu";
import { categoryAPI } from "../dalUser/userApi";

import { useEffect, useState } from "react";
import BrandMenu from "../brands/BrandMenu";
import { useTranslation } from "react-i18next";
import LoadingScreen from "../loadingScreen/LoadingScreen";

const Main = () => {
  const { t, i18n } = useTranslation();
  const [mainCategories, setMainCategories] = useState([]);
  const [discountProducts, setDiscountProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    LoadMainCategories();
    LoadDiscounts();
    LoadBrands();
  }, []);

  const LoadMainCategories = () => {
    categoryAPI
      .getMainCategories()
      .then((response) => {
        setMainCategories(response.data.categories);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {});
  };

  const LoadDiscounts = () => {
    categoryAPI
      .getDiscountsAll()
      .then((response) => {
        const products = response.data.products;
        if (products.length > 0) {
          let i = 0;
          while (products.length < 5) {
            products.push(response.data.products[i]);
            i++;
            if (i === response.data.products.length) i = 0;
          }
          setDiscountProducts(response.data.products);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {});
  };

  const LoadBrands = () => {
    categoryAPI
      .getBrands()
      .then((response) => {
        setBrands(response.data.brands);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div style={{ position: "relative" }}>
      {loading && <LoadingScreen showGif={true} />}
      {discountProducts.length > 0 && (
        <ProductMenu title={t("discount")} products={discountProducts} />
      )}

      <CategoryMenu id="cat" categories={mainCategories} />
      <BrandMenu brands={brands} />
    </div>
  );
};

export default Main;
