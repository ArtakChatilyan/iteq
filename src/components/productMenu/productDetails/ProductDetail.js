import { useContext, useEffect, useState } from "react";
import styles from "./ProductDetails.module.css";
import { Link, useParams } from "react-router-dom";
import { categoryAPI } from "../../dalUser/userApi";
import Slider from "react-slick";
import { LanguageContext } from "../../../contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import LoadingScreen from "../../loadingScreen/LoadingScreen";

const ProductDetail = () => {
  const prodId = useParams().productId;
  const { t, i18n } = useTranslation();
  const lang = useContext(LanguageContext);
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);

  const [selectedUrl, setSelectedUrl] = useState(null);
  const [optionsEn, setOptionsEn] = useState([]);
  const [optionsGe, setOptionsGe] = useState([]);
  const [optionsRu, setOptionsRu] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [brand, setBrand] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    LoadProductCategories(prodId);
    LoadProduct(prodId);
  }, []);

  const LoadProductCategories = (pId) => {
    categoryAPI
      .getProductCategories(pId)
      .then((response) => {
        setCategories(response.data.categories);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const LoadProduct = (pId) => {
    categoryAPI
      .getProduct(prodId)
      .then((response) => {
        console.log(response);

        setProduct(response.data.product);
        setBrand(response.data.brand);
        setImages(response.data.images);
        setSizes(response.data.sizes);
        if (response.data.images.length > 0)
          setSelectedUrl(response.data.images[0].imgUrl);
        else setSelectedUrl(null);

        if (response.data.product.productDescriptionEn) {
          setOptionsEn(JSON.parse(response.data.product.productDescriptionEn));
          setOptionsGe(JSON.parse(response.data.product.productDescriptionGe));
          setOptionsRu(JSON.parse(response.data.product.productDescriptionRu));
        }
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: images.length> 5 ? 5 : images.length,
    slidesToScroll: 1,
  };

  return (
    <div className={styles.block}>
      {loading && <LoadingScreen showGif={true} />}
      {product && (
        <div className={styles.content}>
          <div className={styles.imgSlide}>
            <img src={selectedUrl} className={styles.selectedImage} />
            <Slider {...settings}>
              {images.map((im) => (
                <div style={{ width: "200px", border: "0", cursor: "pointer" }}>
                  <img
                    key={im.id}
                    src={im.imgUrl}
                    onClick={(e) => setSelectedUrl(e.currentTarget.src)}
                  />
                </div>
              ))}
            </Slider>
          </div>
          <div className={styles.infoContent}>
            {categories.map((c) => (
              <Link
                to={`/category/${c.categoryId}`}
                className={styles.categoryTitle}
              >
                {c.nameEn}
              </Link>
            ))}
            <h1 className={`${styles.name} ${styles.title}`}>
              {lang === "en" && product.productNameEn}
              {lang === "ge" && product.productNameGe}
              {lang === "ru" && product.productNameRu}
            </h1>
            {!product.productMultyDimension &&
              (product.productDiscount === 1 ? (
                <div>
                  <span className={styles.price}>
                    {product.productNewPrice}&#8382;
                  </span>
                  <span className={styles.old}>
                    {product.productPrice}&#8382;
                  </span>
                </div>
              ) : (
                <div>
                  <span className={styles.price}>
                    {product.productPrice}&#8382;
                  </span>
                </div>
              ))}

            <table className={styles.mainTable}>
              <tbody>
                {product.productModel && (
                  <tr>
                    <td className={styles.maintd}>
                      <span className={styles.label}>{t("model")}</span>
                    </td>
                    <td className={styles.maintd}>
                      <span className={styles.name}>
                        {product.productModel}
                      </span>
                    </td>
                  </tr>
                )}

                {brand && (
                  <tr>
                    <td className={styles.maintd}>
                      <span className={styles.label}>{t("brand")}</span>
                    </td>
                    <td className={styles.maintd}>
                      <span className={styles.name}>{brand.brandName}</span>
                    </td>
                  </tr>
                )}

                {product.productDimension && (
                  <tr>
                    <td className={styles.maintd}>
                      <span className={styles.label}>{t("dimension")}</span>
                    </td>
                    <td className={styles.maintd}>
                      <span className={styles.name}>
                        {product.productDimension}
                      </span>
                    </td>
                  </tr>
                )}

                {product.productWeight && (
                  <tr>
                    <td className={styles.maintd}>
                      <span className={styles.label}>{t("weight")}</span>
                    </td>
                    <td className={styles.maintd}>
                      <span className={styles.name}>
                        {product.productWeight}
                      </span>
                    </td>
                  </tr>
                )}

                {product.productCountryEn && (
                  <tr>
                    <td className={styles.maintd}>
                      <span className={styles.label}>{t("country")}</span>
                    </td>
                    <td className={styles.maintd}>
                      <span className={styles.name}>
                        {lang === "en" && product.productCountryEn}
                        {lang === "ge" && product.productCountryGe}
                        {lang === "ru" && product.productCountryRu}
                      </span>
                    </td>
                  </tr>
                )}
                {!product.productMultyDimension && (
                  <tr>
                    <td className={styles.maintd}>
                      <span className={styles.label}>{t("count")}</span>
                    </td>
                    <td className={styles.maintd}>
                      <input className={styles.input} />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {!product.productMultyDimension && (
              <div className={styles.item}>
                <button className={styles.btn}>{t("addToCart")}</button>
              </div>
            )}
            <div className={styles.optionsContent}>
              <table>
                <tbody>
                  {lang === "en" &&
                    optionsEn &&
                    optionsEn.map((inputField, index) => (
                      <tr>
                        <td className={styles.td}>
                          <span className={styles.label}>
                            {inputField.optionNameEn}:
                          </span>
                        </td>
                        <td className={styles.td}>
                          <span className={styles.name}>
                            {inputField.optionValueEn}
                          </span>
                        </td>
                      </tr>
                    ))}
                  {lang === "ge" &&
                    optionsGe &&
                    optionsGe.map((inputField, index) => (
                      <tr>
                        <td className={styles.td}>
                          <span className={styles.label}>
                            {inputField.optionNameGe}:
                          </span>
                        </td>
                        <td className={styles.td}>
                          <span className={styles.name}>
                            {inputField.optionValueGe}
                          </span>
                        </td>
                      </tr>
                    ))}
                  {lang === "ru" &&
                    optionsRu &&
                    optionsRu.map((inputField, index) => (
                      <tr>
                        <td className={styles.td}>
                          <span className={styles.label}>
                            {inputField.optionNameRu}:
                          </span>
                        </td>
                        <td className={styles.td}>
                          <span className={styles.name}>
                            {inputField.optionValueRu}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {product.productMultyDimension === 1 && (
              <div className={styles.optionsContent}>
                <table>
                  <thead>
                    <tr>
                      <td className={styles.td}>
                        <span className={styles.label}>{t("dimension")}</span>
                      </td>
                      <td className={styles.td}>
                        <span className={styles.label}>{t("weight")}</span>
                      </td>
                      <td className={styles.td}>
                        <span className={styles.label}>
                          {t("price")}&#8382;
                        </span>
                      </td>
                      <td className={styles.td}>
                        <span className={styles.label}>{t("count")}</span>
                      </td>
                      <td></td>
                    </tr>
                  </thead>
                  <tbody>
                    {sizes.map(
                      (s) =>
                        s.inStock == 1 && (
                          <tr>
                            <td className={styles.td}>
                              <span className={styles.name}>{s.dimension}</span>
                            </td>
                            <td className={styles.td}>
                              <span className={styles.name}>{s.weight}</span>
                            </td>
                            <td className={styles.td}>
                              {s.discount === 1 ? (
                                  <div>
                                    <span className={styles.price} style={{marginRight: "6px"}}>
                                      {s.newPrice}&#8382;
                                    </span>
                                    <span className={styles.old}>
                                      {s.price}&#8382;
                                    </span>
                                  </div>
                                ) : (
                                  <div>
                                    <span className={styles.price}>
                                      {s.price}&#8382;
                                    </span>
                                  </div>
                                )}
                            </td>
                            <td className={styles.td}>
                              <input
                                className={styles.input}
                                type="number"
                                min={1}
                                max={s.count}
                                onChange={(e) => {
                                  if (parseInt(e.currentTarget.value) > s.count)
                                    e.currentTarget.value = s.count;
                                }}
                              />
                              <span>max: {s.count}</span>
                            </td>
                            <td className={styles.td}>
                              <button
                                className={styles.btn}
                                style={{ margin: "10px 0" }}
                              >
                                {t("addToCart")}
                              </button>
                            </td>
                          </tr>
                        )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
