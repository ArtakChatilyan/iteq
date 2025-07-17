import { useContext, useEffect, useState } from "react";
import styles from "./ProductDetails.module.css";
import { Link, useParams } from "react-router-dom";
import { categoryAPI, imageAPI } from "../../dalUser/userApi";
import Slider from "react-slick";
import "./slideExtra.css";
import { LanguageContext } from "../../../contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import LoadingScreen from "../../loadingScreen/LoadingScreen";

const ProductDetail = () => {
  const { productId } = useParams();

  const { t, i18n } = useTranslation();
  const lang = useContext(LanguageContext);
  const [loading, setLoading] = useState(true);

  const [product, setProduct] = useState(null);
  const [brand, setBrand] = useState(null);
  const [categories, setCategories] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  //const [images, setImages] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [descriptions, setDescriptions] = useState([]);
  const [selectedDescription, setSelectedDescription] = useState("");

  const [selectedCount, setSelectedCount] = useState([]);
  // const [multiColor, setMultiColor] = useState(0);
  // const [multiSize, setMultiSize] = useState(0);

  // const [descriptions, setDescriptions]=useState([]);

  // const [optionsEn, setOptionsEn] = useState([]);
  // const [optionsGe, setOptionsGe] = useState([]);
  // const [optionsRu, setOptionsRu] = useState([]);

  useEffect(() => {
    LoadProductCategories(productId);
    LoadProduct(productId);
    //LoadImages(productId);
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
        for (let i = 0; i < response.data.models.length; i++) {
          for (let j = 0; j < response.data.models[i].sizes.length; j++) {
            selectedCount.push({
              sId: response.data.models[i].sizes[j].id,
              selectedCount: 1,
            });
          }
        }
        setProduct(response.data.product);
        setBrand(response.data.brand);
        setModels(response.data.models);
        if (response.data.models.length > 0) {
          setSelectedModel(response.data.models[0]);
        }

        // if (response.data.product.productMultyColor) {
        //   setMultiColor(response.data.product.productMultyColor);

        //   setColors(response.data.colors);
        //   if (response.data.colors.length > 0)
        //     setSelectedColor(response.data.colors[0]);
        // }
        // if (response.data.product.productMultyDimension) {
        //   setMultiSize(response.data.product.productMultyDimension);
        //   setSizes(response.data.sizes);
        //   if (response.data.sizes.length > 0) {
        //     setSelectedSize(response.data.sizes[0]);
        //   }
        // }

        // if (response.data.product.productDescriptionEn) {
        //   setOptionsEn(JSON.parse(response.data.product.productDescriptionEn));
        //   setOptionsGe(JSON.parse(response.data.product.productDescriptionGe));
        //   setOptionsRu(JSON.parse(response.data.product.productDescriptionRu));
        // }
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (selectedModel) {
      setColors(selectedModel.colors);
      if (selectedModel.colors.length > 0) {
        setSelectedColor(selectedModel.colors[0]);
      } else {
        setSelectedColor(null);
      }
      setSizes(selectedModel.sizes);
      if (selectedModel.sizes.length > 0) {
        setSelectedSize(selectedModel.sizes[0]);
      } else {
        setSelectedSize(null);
      }
    } else {
    }
  }, [selectedModel]);

  useEffect(() => {
    if (selectedModel) {
      if (selectedModel.imageLinks.length > 0) {
        let imageData = [];
        if (selectedColor != null && selectedSize != null) {
          imageData = selectedModel.imageLinks.filter(
            (i) =>
              i.colorId === selectedColor.id && i.sizeId === selectedSize.id
          );
        } else if (selectedColor != null && selectedSize === null) {
          imageData = selectedModel.imageLinks.filter(
            (i) => i.colorId === selectedColor.id
          );
        } else if (selectedColor === null && selectedSize != null) {
          imageData = selectedModel.imageLinks.filter(
            (i) => i.sizeId === selectedSize.id
          );
        } else {
          imageData = selectedModel.imageLinks;
        }

        setImages(imageData);
        if (imageData.length > 0) setSelectedUrl(imageData[0].imgUrl);
      } else {
        setImages([]);
        setSelectedUrl(null);
      }

      if (selectedModel.descriptionLinks.length > 0) {
        let infoData = [];
        if (selectedColor != null && selectedSize != null) {
          infoData = selectedModel.descriptionLinks.filter(
            (d) =>
              d.colorId === selectedColor.id && d.sizeId === selectedSize.id
          );
        } else if (selectedColor != null && selectedSize === null) {
          infoData = selectedModel.descriptionLinks.filter(
            (d) => d.colorId === selectedColor.id
          );
        } else if (selectedColor === null && selectedSize != null) {
          infoData = selectedModel.descriptionLinks.filter(
            (d) => d.sizeId === selectedSize.id
          );
        } else {
          infoData = selectedModel.descriptionLinks;
        }
        setDescriptions(infoData);
      } else {
        setDescriptions([]);
      }
    }
  }, [selectedColor, selectedSize]);

  // const LoadImages = (productId) => {
  //   imageAPI
  //     .getImagesDefault(productId)
  //     .then((response) => {
  //       console.log(response);

  //       setImages(response.data.images);
  //       // if (response.data.images.length > 0)
  //       //   setSelectedUrl(response.data.images[0].imgUrl);
  //       // else setSelectedUrl(null);
  //     })
  //     .catch((error) => console.log(error));
  //   // if (multiColor === 1 && multiSize === 1) {
  //   //   LoadImagesMix(productId);
  //   // } else if (multiColor === 0 && multiSize === 1) {
  //   //   LoadImagesBySize(productId);
  //   // } else if (multiSize === 0 && multiColor === 1) {
  //   //   LoadImagesByColor(productId);
  //   // } else {
  //   //   LoadImagesDefault(productId);
  //   // }
  // };

  const LoadImagesDefault = (productId) => {
    // imageAPI
    //   .getImagesDefault(productId)
    //   .then((response) => {
    //     setImages((images) => response.data.images);
    //     if (response.data.images.length > 0)
    //       setSelectedUrl(response.data.images[0].imgUrl);
    //     else setSelectedUrl(null);
    //   })
    //   .catch((error) => console.log(error));
  };

  const LoadImagesByColor = (productId) => {
    // imageAPI
    //   .getImagesByColor(productId)
    //   .then((response) => {
    //     console.log(response);
    //     setImages(response.data.images);
    //     if (response.data.images.length > 0)
    //       setSelectedUrl(response.data.images[0].imgUrl);
    //     else setSelectedUrl(null);
    //   })
    //   .catch((error) => console.log(error));
  };

  const LoadImagesBySize = (productId) => {
    // imageAPI
    //   .getImagesBySize(productId)
    //   .then((response) => {
    //     setImages((images) => response.data.images);
    //     if (response.data.images.length > 0)
    //       setSelectedUrl(response.data.images[0].imgUrl);
    //     else setSelectedUrl(null);
    //   })
    //   .catch((error) => console.log(error));
  };

  const LoadImagesMix = (productId) => {
    // imageAPI
    //   .getImagesMix(productId)
    //   .then((response) => {
    //     setImages(response.data.images);
    //     if (response.data.images.length > 0)
    //       setSelectedUrl(response.data.images[0].imgUrl);
    //     else setSelectedUrl(null);
    //   })
    //   .catch((error) => console.log(error));
  };

  // useEffect(() => {
  //   // if(images.length>0)
  //   // LoadSlider();
  // }, [images, selectedColor, selectedSize]);

  const LoadSlider = () => {
    // if (selectedColor && selectedSize) {
    //   const newImages = images
    //     .filter(
    //       (c) => c.colorId === selectedColor.id && c.sizeId === selectedSize.id
    //     )
    //     .filter(
    //       (obj, index, self) => index === self.findIndex((o) => o.id === obj.id)
    //     );
    //   if (newImages.length > 0) setSelectedUrl(newImages[0].imgUrl);
    //   else setSelectedUrl(null);
    //   setSelectedImages(newImages);
    // } else if (selectedColor && !selectedSize) {
    //   const newImages = images
    //     .filter((c) => c.colorId === selectedColor.id)
    //     .filter(
    //       (obj, index, self) => index === self.findIndex((o) => o.id === obj.id)
    //     );
    //   if (newImages.length > 0) setSelectedUrl(newImages[0].imgUrl);
    //   else setSelectedUrl(null);
    //   setSelectedImages(newImages);
    // } else if (!selectedColor && selectedSize) {
    //   const newImages = images
    //     .filter((c) => c.sizeId === selectedSize.id)
    //     .filter(
    //       (obj, index, self) => index === self.findIndex((o) => o.id === obj.id)
    //     );
    //   if (newImages.length > 0) setSelectedUrl(newImages[0].imgUrl);
    //   else setSelectedUrl(null);
    //   setSelectedImages(newImages);
    // } else {
    //   if (images.length > 0) setSelectedUrl(images[0].imgUrl);
    //   else setSelectedUrl(null);
    //   setSelectedImages(images);
    // }
  };

  const selectActiveModel = (modelId) => {
    setSelectedModel(models.find((m) => m.id === modelId));
  };

  const selectActiveColor = (colorId) => {
    setSelectedColor(colors.find((c) => c.id === colorId));
  };

  const selectActiveSize = (sizeId) => {
    setSelectedSize(sizes.find((s) => s.id === sizeId));
  };

  const settings = {
    dots: false,
    infinite: images.length > 5,
    speed: 500,
    slidesToShow: images.length > 5 ? 5 : images.length,
    slidesToScroll: images.length > 5 ? 1 : 0,
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
              onClick={() => console.log(selectedCount)}
            >
              {lang === "en" && product.productNameEn}
              {lang === "ge" && product.productNameGe}
              {lang === "ru" && product.productNameRu}
            </h1>

            <div className={styles.colorBlock}>
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
            {/* {!product.productMultyDimension &&
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
              ))} */}

            <table className={styles.mainTable}>
              <tbody>
                {product.productModel && (
                  <tr>
                    <td className={styles.maintd}>
                      <span className={styles.label}>{t("model")}</span>
                    </td>
                    <td className={styles.maintd}>
                      {models.map((m) => (
                        <span
                          onClick={() => selectActiveModel(m.id)}
                          className={`${styles.model} ${
                            m.id === selectedModel.id
                              ? styles.selectedModel
                              : ""
                          }`}
                        >
                          {lang === "en" && m.nameEn}
                          {lang === "ge" && m.nameGe}
                          {lang === "ru" && m.nameRu}
                        </span>
                      ))}
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

                {/* {product.productDimension && (
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
                )} */}

                {/* {product.productWeight && (
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
                )} */}

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
                {/* {!product.productMultyDimension && (
                  <tr>
                    <td className={styles.maintd}>
                      <span className={styles.label}>{t("count")}</span>
                    </td>
                    <td className={styles.maintd}>
                      <input className={styles.input} />
                    </td>
                  </tr>
                )} */}
              </tbody>
            </table>
            {/* {!product.productMultyDimension && (
              <div className={styles.item}>
                <button className={styles.btn}>{t("addToCart")}</button>
              </div>
            )} */}

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
                      <span className={styles.label}>{t("price")}&#8382;</span>
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
                                  {s.newPrice *
                                    selectedCount.find((sc) => sc.sId === s.id)
                                      .selectedCount}
                                  &#8382;
                                </span>
                                <span className={styles.old}>
                                  {s.price *
                                    selectedCount.find((sc) => sc.sId === s.id)
                                      .selectedCount}
                                  &#8382;
                                </span>
                              </div>
                            ) : (
                              <div>
                                <span className={styles.price}>
                                  {s.price *
                                    selectedCount.find((sc) => sc.sId === s.id)
                                      .selectedCount}
                                  &#8382;
                                </span>
                              </div>
                            )}
                          </td>
                          <td className={styles.td}>
                            <input
                              className={styles.input}
                              value={
                                selectedCount.find((sc) => sc.sId === s.id)
                                  .selectedCount
                              }
                              type="number"
                              min={1}
                              max={s.count}
                              onChange={(e) => {
                                if (parseInt(e.currentTarget.value) > s.count) {
                                  e.currentTarget.value = s.count;
                                  setSelectedCount([...selectedCount.filter(sc=>sc.sId!=s.id), {sId: s.id, selectedCount: e.currentTarget.value}])
                                }else{
                                  setSelectedCount([...selectedCount.filter(sc=>sc.sId!=s.id), {sId: s.id, selectedCount: e.currentTarget.value}])
                                }
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

            <div className={styles.optionsContent}>
              <table>
                <tbody>
                  <tr>
                    <td className={styles.td}>
                      <span className={styles.label}>{t("description")}</span>
                    </td>
                    <td className={styles.td}>
                      {descriptions.map((d) => (
                        <span className={styles.name}>
                          {lang === "en" && d.descriptionEn}
                          {lang === "ge" && d.descriptionGe}
                          {lang === "ru" && d.descriptionRu}
                        </span>
                      ))}
                    </td>
                  </tr>
                  {/* {lang === "en" &&
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
                    ))} */}
                  {/* {lang === "ge" &&
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
                    ))} */}
                  {/* {lang === "ru" &&
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
                    ))} */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
