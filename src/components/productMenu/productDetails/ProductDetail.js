import { useContext, useEffect, useState } from "react";
import styles from "./ProductDetails.module.css";
import { Link, useParams } from "react-router-dom";
import { categoryAPI, imageAPI } from "../../dalUser/userApi";
import Slider from "react-slick";
import "./slideExtra.css";
import { LanguageContext } from "../../../contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import LoadingScreen from "../../loadingScreen/LoadingScreen";
import colorIcon from "../../../assets/back.png";

const ProductDetail = () => {
  const { productId } = useParams();

  const { t, i18n } = useTranslation();
  const lang = useContext(LanguageContext);
  const [loading, setLoading] = useState(true);

  const [product, setProduct] = useState(null);
  const [brand, setBrand] = useState(null);
  const [categories, setCategories] = useState([]);
  const [multiColor, setMultiColor] = useState(0);
  const [multiSize, setMultiSize] = useState(0);

  const [images, setImages] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState(null);

  const [optionsEn, setOptionsEn] = useState([]);
  const [optionsGe, setOptionsGe] = useState([]);
  const [optionsRu, setOptionsRu] = useState([]);

  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  let [selectedImages, setSelectedImages] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    LoadProductCategories(productId);
    LoadProduct(productId);
  }, [productId]);

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
      .getProduct(productId)
      .then((response) => {
        setProduct(response.data.product);
        setBrand(response.data.brand);
        if (response.data.product.productMultyColor) {
          setMultiColor(response.data.product.productMultyColor);

          setColors(response.data.colors);
          if (response.data.colors.length > 0)
            setSelectedColor(response.data.colors[0]);
        }
        if (response.data.product.productMultyDimension) {
          setMultiSize(response.data.product.productMultyDimension);
          setSizes(response.data.sizes);
          if (response.data.sizes.length > 0) {
            setSelectedSize(response.data.sizes[0]);
          }
        }

        if (response.data.product.productDescriptionEn) {
          setOptionsEn(JSON.parse(response.data.product.productDescriptionEn));
          setOptionsGe(JSON.parse(response.data.product.productDescriptionGe));
          setOptionsRu(JSON.parse(response.data.product.productDescriptionRu));
        }
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    LoadImages(productId);
  }, [productId, multiColor, multiSize]);

  const LoadImages = (productId) => {
    if (multiColor === 1 && multiSize === 1) {
      LoadImagesMix(productId);
    } else if (multiColor === 0 && multiSize === 1) {
      LoadImagesBySize(productId);
    } else if (multiSize === 0 && multiColor === 1) {
      LoadImagesByColor(productId);
    } else {
      LoadImagesDefault(productId);
    }
  };

  const LoadImagesDefault = (productId) => {
    imageAPI
      .getImagesDefault(productId)
      .then((response) => {
        setImages((images) => response.data.images);
        if (response.data.images.length > 0)
          setSelectedUrl(response.data.images[0].imgUrl);
        else setSelectedUrl(null);
      })
      .catch((error) => console.log(error));
  };

  const LoadImagesByColor = (productId) => {
    imageAPI
      .getImagesByColor(productId)
      .then((response) => {
        setImages((images) => response.data.images);
        if (response.data.images.length > 0)
          setSelectedUrl(response.data.images[0].imgUrl);
        else setSelectedUrl(null);
      })
      .catch((error) => console.log(error));
  };

  const LoadImagesBySize = (productId) => {
    imageAPI
      .getImagesBySize(productId)
      .then((response) => {
        setImages((images) => response.data.images);
        if (response.data.images.length > 0)
          setSelectedUrl(response.data.images[0].imgUrl);
        else setSelectedUrl(null);
      })
      .catch((error) => console.log(error));
  };

  const LoadImagesMix = (productId) => {
    imageAPI
      .getImagesMix(productId)
      .then((response) => {
        setImages(response.data.images);
        if (response.data.images.length > 0)
          setSelectedUrl(response.data.images[0].imgUrl);
        else setSelectedUrl(null);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    LoadSlider();
  }, [images, selectedColor, selectedSize]);

  const LoadSlider = () => {
    if (selectedColor && selectedSize) {
      const newImages = images
        .filter(
          (c) => c.colorId === selectedColor.id && c.sizeId === selectedSize.id
        )
        .filter(
          (obj, index, self) => index === self.findIndex((o) => o.id === obj.id)
        );
      if (newImages.length > 0) setSelectedUrl(newImages[0].imgUrl);
      else setSelectedUrl(null);
      setSelectedImages(newImages);
    } else if (selectedColor && !selectedSize) {
      const newImages = images
        .filter((c) => c.colorId === selectedColor.id)
        .filter(
          (obj, index, self) => index === self.findIndex((o) => o.id === obj.id)
        );
      if (newImages.length > 0) setSelectedUrl(newImages[0].imgUrl);
      else setSelectedUrl(null);
      setSelectedImages(newImages);
    } else if (!selectedColor && selectedSize) {
      const newImages = images
        .filter((c) => c.sizeId === selectedSize.id)
        .filter(
          (obj, index, self) => index === self.findIndex((o) => o.id === obj.id)
        );
      if (newImages.length > 0) setSelectedUrl(newImages[0].imgUrl);
      else setSelectedUrl(null);
      setSelectedImages(newImages);
    } else {
      if (images.length > 0) setSelectedUrl(images[0].imgUrl);
      else setSelectedUrl(null);
      setSelectedImages(images);
    }
  };

  const selectActiveColor = (colorId) => {
    setSelectedColor(colors.find((c) => c.id === colorId));
  };

  const selectActiveSize = (sizeId) => {
    setSelectedSize(sizes.find((s) => s.id === sizeId));
  };

  const settings = {
    dots: false,
    infinite: selectedImages.length > 5,
    speed: 500,
    slidesToShow: selectedImages.length > 5 ? 5 : selectedImages.length,
    slidesToScroll: selectedImages.length > 5 ? 1 : 0,
  };

  return (
    <div className={styles.block}>
      {loading && <LoadingScreen showGif={true} />}
      {product && (
        <div className={styles.content}>
          <div className={styles.imgSlide}>
            <img src={selectedUrl} className={styles.selectedImage} />
            <Slider {...settings}>
              {selectedImages.map((im) => (
                <div
                  style={{
                    width: "200px",
                    maxWidth: "200px",
                    border: "0",
                    cursor: "pointer",
                  }}
                >
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
                key={`c${c.id}`}
                to={`/category/${c.categoryId}`}
                className={styles.categoryTitle}
              >
                {lang === "en" && c.nameEn}
                {lang === "ge" && c.nameGe}
                {lang === "ru" && c.nameRu}
              </Link>
            ))}
            <h1
              className={`${styles.name} ${styles.title}`}
              onClick={() => console.log(images)}
            >
              {lang === "en" && product.productNameEn}
              {lang === "ge" && product.productNameGe}
              {lang === "ru" && product.productNameRu}
            </h1>

            <div className={styles.colorBlock}>
              {multiColor && (
                <div className={styles.colorContainer}>
                  {colors.map((c) => (
                    <div key={`color${c.id}`} className={styles.colorItem}>
                      <img
                        src={c.iconUrl}
                        className={`${styles.colorIcon} ${
                          c.id == selectedColor.id ? styles.selectedColor : ""
                        }`}
                        onClick={() => selectActiveColor(c.id)}
                      />
                    </div>
                  ))}
                </div>
              )}
              {selectedColor && (
                <div style={{ textAlign: "left" }}>
                  <span
                    className={styles.label}
                    style={{ margin: ".6rem 1rem 0 .6rem" }}
                  >
                    {t("color")}
                  </span>
                  {lang === "en" && selectedColor.nameEn}
                  {lang === "ge" && selectedColor.nameGe}
                  {lang === "ru" && selectedColor.nameRu}
                </div>
              )}
            </div>
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
                          <tr
                            key={`size${s.id}`}
                            className={`${styles.sizeItem} ${
                              selectedSize.id == s.id ? styles.selectedSize : ""
                            }`}
                            onClick={() => selectActiveSize(s.id)}
                          >
                            <td className={styles.td}>
                              <span className={styles.name}>{s.dimension}</span>
                            </td>
                            <td className={styles.td}>
                              <span className={styles.name}>{s.weight}</span>
                            </td>
                            <td className={styles.td}>
                              {s.discount === 1 ? (
                                <div>
                                  <span
                                    className={styles.price}
                                    style={{ marginRight: "6px" }}
                                  >
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
                                disabled={selectedSize.id != s.id}
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
