import { useContext, useEffect, useRef, useState } from "react";
import styles from "./ProductDetails.module.css";
import { Link, useParams } from "react-router-dom";
import useScreenSize from "../../tools/ScreenSize";
import { basketAPI, categoryAPI, imageAPI } from "../../dalUser/userApi";
import Slider from "react-slick";
import "./slideExtraDetail.css";
import { LanguageContext } from "../../../contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import LoadingScreen from "../../loadingScreen/LoadingScreen";
import { useDispatch, useSelector } from "react-redux";
import { getBasketItemsCount } from "../../../redux-store/userSlice";

const ProductDetail = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.userReducer.isAuth);
  const user = useSelector((state) => state.userReducer.user);
  const { productId } = useParams();

  const { t, i18n } = useTranslation();
  const lang = useContext(LanguageContext);
  const [loading, setLoading] = useState(true);

  const { width, height } = useScreenSize();

  const [product, setProduct] = useState(null);
  const [brand, setBrand] = useState(null);
  const [categories, setCategories] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const [images, setImages] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [descriptions, setDescriptions] = useState([]);
  const [selectedDescription, setSelectedDescription] = useState("");

  const [selectedCount, setSelectedCount] = useState([]);

  const [modalInfo, setModalInfo] = useState(false);
  const [isAnimateInfo, setIsAnimateInfo] = useState(false);

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

  const addToBasket = () => {
    if (!isAuth) {
      alert("please log in to add product to basket");
    } else {
      setLoading(true);
      basketAPI
        .addBasket({
          userId: user.userId,
          productId,
          modelId: selectedModel.id,
          sizeId: selectedSize.id,
          colorId: selectedColor ? selectedColor.id : 0,
          count: selectedCount.find((c) => c.sId === selectedSize.id)
            .selectedCount,
        })
        .then((response) => {
          dispatch(getBasketItemsCount(user.userId));
          setModalInfo(true);
          setIsAnimateInfo(true);
        })
        .catch((error) => console.log(error))
        .finally(() => {
          setLoading(false);
        });
    }
  };
  const sourceRef = useRef(null);
  const targetRef = useRef(null);
  const containerRef = useRef(null);
  const [opacity, setOpacity] = useState(0);
  const [offset, setOffset] = useState({ left: 0, top: 0 });
  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };
  const handleMouseMove = (e) => {
    const targetRect = targetRef.current.getBoundingClientRect();
    const sourceRect = sourceRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    const xRatio = (targetRect.width - containerRect.width) / sourceRect.width;
    const yRatio =
      (targetRect.height - containerRect.height) / sourceRect.height;

    const left = Math.max(
      Math.min(e.pageX - sourceRect.left, sourceRect.width),
      0
    );
    const top = Math.max(
      Math.min(e.pageY - sourceRect.top, sourceRect.height),
      0
    );

    setOffset({
      left: left * -xRatio,
      top: top * -yRatio,
    });
  };

  const closeModalInfo = () => {
    setIsAnimateInfo(false);
    setTimeout(() => {
      setModalInfo(false);
    }, 600);
  };
  return (
    <div className={styles.block}>
      {loading && <LoadingScreen showGif={true} />}
      <div className={modalInfo ? styles.modal : styles.hide}>
        <div
          className={
            isAnimateInfo
              ? "animate__animated animate__bounceInDown"
              : "animate__animated animate__bounceOutUp"
          }
        >
          <div className={styles.infoGroup}>
            <div className={styles.info}>product added to basket</div>
            <button className={styles.btn} onClick={closeModalInfo}>
              ok
            </button>
          </div>
        </div>
      </div>
      {product && (
        <div className={styles.content}>
          <div className={styles.imgSlide}>
            <div
              className={styles.imgContainer}
              ref={containerRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
            >
              <img
                src={selectedUrl}
                ref={sourceRef}
                className={styles.selectedImage}
                style={{
                  display: "block",
                  opacity: opacity ? 0 : 1,
                }}
              />

              <img
                ref={targetRef}
                src={selectedUrl}
                style={{
                  display: "block",
                  position: "absolute",
                  left: offset.left,
                  top: offset.top,
                  opacity: opacity,
                }}
              />
            </div>
            <Slider {...settings}>
              {images.map((im) => (
                <div
                  style={{
                    width: "200px",
                    maxWidth: "200px",
                    maxHeight: "120px",
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
            <div className={styles.categoryContent}>
              {categories.map((c) => (
                <Link
                  key={`c${c.id}`}
                  to={`/category/${c.categoryId}/${0}/${-1}/${-1}/${1}`}
                  className={styles.categoryTitle}
                >
                  {lang === "en" && c.nameEn}
                  {lang === "ge" && c.nameGe}
                  {lang === "ru" && c.nameRu}
                </Link>
              ))}
            </div>
            <h1 className={styles.title}>
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
            <table className={styles.mainTable}>
              <tbody>
                <tr>
                  <td className={styles.maintd}>
                    <span className={styles.label}>{t("model")}</span>
                  </td>
                  <td className={styles.maintd}>
                    {models.map((m) => (
                      <span
                        onClick={() => selectActiveModel(m.id)}
                        className={`${styles.model} ${
                          m.id === selectedModel.id ? styles.selectedModel : ""
                        }`}
                      >
                        {lang === "en" && m.nameEn}
                        {lang === "ge" && m.nameGe}
                        {lang === "ru" && m.nameRu}
                      </span>
                    ))}
                  </td>
                </tr>

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
              </tbody>
            </table>
            <div className={styles.optionsContent}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    {selectedModel.sizes.some((s) => s.dimension) && (
                      <td className={styles.td}>
                        <span className={styles.label}>{t("dimension")}</span>
                      </td>
                    )}
                    {selectedModel.sizes.some((s) => s.weight) && (
                      <td className={styles.td}>
                        <span className={styles.label}>{t("weight")}</span>
                      </td>
                    )}
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
                          {s.dimension && (
                            <td className={styles.td}>
                              <span
                                className={styles.name}
                                style={{ textWrap: "nowrap" }}
                              >
                                {s.dimension}
                              </span>
                            </td>
                          )}

                          {s.weight && (
                            <td className={styles.td}>
                              <span className={styles.name}>{s.weight}</span>
                            </td>
                          )}

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
                              onChange={(e) => {
                                setSelectedCount([
                                  ...selectedCount.filter(
                                    (sc) => sc.sId != s.id
                                  ),
                                  {
                                    sId: s.id,
                                    selectedCount: e.currentTarget.value,
                                  },
                                ]);
                              }}
                              // max={s.count}
                              // onChange={(e) => {
                              //   if (parseInt(e.currentTarget.value) > s.count) {
                              //     e.currentTarget.value = s.count;
                              //     setSelectedCount([
                              //       ...selectedCount.filter(
                              //         (sc) => sc.sId != s.id
                              //       ),
                              //       {
                              //         sId: s.id,
                              //         selectedCount: e.currentTarget.value,
                              //       },
                              //     ]);
                              //   } else {
                              //     setSelectedCount([
                              //       ...selectedCount.filter(
                              //         (sc) => sc.sId != s.id
                              //       ),
                              //       {
                              //         sId: s.id,
                              //         selectedCount: e.currentTarget.value,
                              //       },
                              //     ]);
                              //   }
                              // }}
                            />
                            {/* <span>max: {s.count}</span> */}
                          </td>
                          <td className={styles.td}>
                            <button
                              disabled={selectedSize.id != s.id}
                              className={styles.btn}
                              style={{ margin: "10px 0" }}
                              onClick={addToBasket}
                            >
                              <span className={styles.addLong}>
                                {t("addToCart")}
                              </span>
                              <span className={styles.addShort}>+</span>
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
                    <td className={`${styles.td} ${styles.description}`}>
                      <span className={styles.label}>{t("description")}</span>
                    </td>
                    <td className={styles.td}>
                      {descriptions.map((d) => (
                        <span className={styles.descriptionContent}>
                          {lang === "en" && d.descriptionEn}
                          {lang === "ge" && d.descriptionGe}
                          {lang === "ru" && d.descriptionRu}
                        </span>
                      ))}
                    </td>
                  </tr>
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
