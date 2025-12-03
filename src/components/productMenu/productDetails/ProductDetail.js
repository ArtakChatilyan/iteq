import { useEffect, useRef, useState } from "react";
import styles from "./ProductDetails.module.css";
import { Link, useParams } from "react-router-dom";
import useScreenSize from "../../tools/ScreenSize";
import { basketAPI, categoryAPI, imageAPI } from "../../dalUser/userApi";
import Slider from "react-slick";
import "./slideExtraDetail.css";
import { useTranslation } from "react-i18next";
import LoadingScreen from "../../loadingScreen/LoadingScreen";
import { useDispatch, useSelector } from "react-redux";
import { getBasketItemsCount } from "../../../redux-store/userSlice";
import ReactPlayer from "react-player";
import playIcon from "../../../assets/playIcon.png";
import { Helmet } from "react-helmet-async";
import { ProductSeoData } from "../../seotags/ProductSEO";

const ProductDetail = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.userReducer.isAuth);
  const user = useSelector((state) => state.userReducer.user);
  const { productId, lang } = useParams();

  const { t } = useTranslation();
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
  const [medias, setMedias] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [selectedFileType, setSelectedFileType] = useState(false);
  const [descriptions, setDescriptions] = useState([]);
  const [selectedDescription, setSelectedDescription] = useState("");

  const [selectedCount, setSelectedCount] = useState([]);

  const [modalInfo, setModalInfo] = useState(false);
  const [isAnimateInfo, setIsAnimateInfo] = useState(false);
  const [seoData, setSeoData] = useState(null);

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

        if (imageData.length > 0) {
          setSelectedUrl(imageData[0].imgUrl);
          setSelectedFileType(false);
        }
      } else {
        setImages([]);
        setSelectedUrl(null);
      }

      // //selectedModel.mediaLinks=["https://www.youtube.com/watch?v=XMESkfQAes4"];
      // console.log(selectedModel.mediaLinks);
      // selectedModel.mediaLinks.forEach(element => {
      //   element.mediaUrl="https://www.youtube.com/watch?v=XMESkfQAes4";
      // });

      if (selectedModel.mediaLinks.length > 0) {
        let mediaData = [];
        if (selectedColor != null && selectedSize != null) {
          mediaData = selectedModel.mediaLinks.filter(
            (i) =>
              i.colorId === selectedColor.id && i.sizeId === selectedSize.id
          );
        } else if (selectedColor != null && selectedSize === null) {
          mediaData = selectedModel.mediaLinks.filter(
            (i) => i.colorId === selectedColor.id
          );
        } else if (selectedColor === null && selectedSize != null) {
          mediaData = selectedModel.mediaLinks.filter(
            (i) => i.sizeId === selectedSize.id
          );
        } else {
          mediaData = selectedModel.mediaLinks;
        }

        setMedias(mediaData);

        if (mediaData.length > 0) {
          setSelectedUrl(mediaData[0].mediaUrl);
          setSelectedFileType(true);
        }
      } else {
        setMedias([]);
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
    infinite: images.length + medias.length > 5,
    speed: 500,
    slidesToShow:
      images.length + medias.length > 5 ? 5 : images.length + medias.length,
    slidesToScroll: images.length + medias.length > 5 ? 1 : 0,
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

  useEffect(() => {
    if (lang) setSeoData(ProductSeoData[lang]);
  }, [lang]);

  return (
    <>
      {product && seoData && (
        <Helmet key={`${lang}-${product.id}`}>
          {/* Basic SEO */}
          <title>{seoData.title(product.productNameEn)}</title>
          {descriptions.length > 0 && (
            <meta
              property="description"
              content={
                lang === "en"
                  ? descriptions[0].descriptionEn
                  : lang === "ka"
                  ? descriptions[0].descriptionGe
                  : descriptions[0].descriptionRu
              }
            />
          )}

          {/* Open Graph */}
          <meta
            property="og:title"
            content={seoData.title(product.productNameEn)}
          />
          {descriptions.length > 0 && (
            <meta
              property="og:description"
              content={
                lang === "en"
                  ? descriptions[0].descriptionEn
                  : lang === "ka"
                  ? descriptions[0].descriptionGe
                  : descriptions[0].descriptionRu
              }
            />
          )}
          <meta property="og:type" content="product" />
          <meta property="og:url" content={`${seoData.baseUrl}${product.id}`} />
          <meta
            property="og:image"
            content={images.length > 0 && images[0].imgUrl}
          />
          <meta property="og:locale" content={seoData.ogLocale} />
          <meta property="og:locale:alternate" content="en_GB" />
          <meta property="og:locale:alternate" content="ru_RU" />
          <meta property="og:locale:alternate" content="ka_GE" />

          {/* Hreflang links */}
          <link
            rel="alternate"
            href={`https://iteq.shop/en/product/${product.id}`}
            hrefLang="en"
          />
          <link
            rel="alternate"
            href={`https://iteq.shop/ru/product/${product.id}`}
            hrefLang="ru"
          />
          <link
            rel="alternate"
            href={`https://iteq.shop/ka/product/${product.id}`}
            hrefLang="ka"
          />
          <link
            rel="alternate"
            href={`https://iteq.shop/product/${product.id}`}
            hrefLang="x-default"
          />

          {/* JSON-LD Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Product",
                name: product.productNameEn,
                image: images.length > 0 && images[0].imgUrl,
                description:
                  descriptions.length > 0 &&
                  (lang === "en"
                    ? descriptions[0].descriptionEn
                    : lang === "ka"
                    ? descriptions[0].descriptionGe
                    : descriptions[0].descriptionRu),
                brand: {
                  "@type": "Brand",
                  name: brand ? brand.brandName : "",
                  logo: brand ? brand.imgUrl : "",
                },
                sku: selectedModel ? selectedModel.nameEn : "",
                offers: {
                  "@type": "Offer",
                  url: `${seoData.baseUrl}${product.id}`,
                  priceCurrency: "GEL",
                  price: selectedSize
                    ? selectedSize.newPrice > 0
                      ? selectedSize.newPrice
                      : selectedSize.price
                    : "",
                  availability: "https://schema.org/InStock",
                  url: "https://iteq.shop/product/" + productId,
                },
                publisher: {
                  "@type": "Organization",
                  name: "ITEQ",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://iteq.shop/static/media/logo.23ac6e37f7a4d129fcc4.png",
                  },
                },
              }),
            }}
          />
        </Helmet>
      )}
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
              {selectedFileType && (
                <div className={styles.imgContainer}>
                  <ReactPlayer
                    style={{ width: "100%" }}
                    src={selectedUrl}
                    playing={true}
                    controls={true}
                    muted={true}
                  />
                </div>
              )}
              {!selectedFileType && (
                <div
                  className={styles.imgContainer}
                  ref={containerRef}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onMouseMove={handleMouseMove}
                >
                  <div>
                    <img
                      src={selectedUrl}
                      ref={sourceRef}
                      className={styles.selectedImage}
                      style={{
                        display: "block",
                        opacity: opacity ? 0 : 1,
                      }}
                      alt={
                        lang === "en"
                          ? product.productNameEn
                          : lang === "ka"
                          ? product.productNameGe
                          : product.productNameRu
                      }
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
                      alt={
                        lang === "en"
                          ? product.productNameEn
                          : lang === "ka"
                          ? product.productNameGe
                          : product.productNameRu
                      }
                    />
                  </div>
                </div>
              )}
              <Slider {...settings}>
                {medias.map((md) => (
                  <div className={styles.playerWrapper}>
                    <ReactPlayer
                      style={{
                        position: "absolute",
                        width: "100%",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                      key={md.id}
                      src={md.mediaUrl}
                    />
                    <img
                      src={playIcon}
                      className={styles.playIcon}
                      onClick={(e) => {
                        setSelectedUrl(md.mediaUrl);
                        setSelectedFileType(true);
                      }}
                    />
                  </div>
                ))}
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
                      onClick={(e) => {
                        setSelectedUrl(e.currentTarget.src);
                        setSelectedFileType(false);
                      }}
                      alt={
                        lang === "en"
                          ? product.productNameEn
                          : lang === "ka"
                          ? product.productNameGe
                          : product.productNameRu
                      }
                    />
                  </div>
                ))}
              </Slider>
            </div>
            <div className={styles.infoContent}>
              <div className={styles.categoryContent}>
                {categories.map((c) => (
                  <h2>
                    <Link
                      key={`c${c.id}`}
                      to={`/${lang}/category/${
                        c.categoryId
                      }/${0}/${-1}/${-1}/${1}`}
                      className={styles.categoryTitle}
                    >
                      {lang === "en" && c.nameEn}
                      {lang === "ka" && c.nameGe}
                      {lang === "ru" && c.nameRu}
                    </Link>
                  </h2>
                ))}
              </div>
              <h1 className={styles.title}>
                {lang === "en" && product.productNameEn}
                {lang === "ka" && product.productNameGe}
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
                    {lang === "ka" && selectedColor.nameGe}
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
                        <h3
                          key={m.id}
                          onClick={() => selectActiveModel(m.id)}
                          className={`${styles.model} ${
                            m.id === selectedModel.id
                              ? styles.selectedModel
                              : ""
                          }`}
                        >
                          {lang === "en" && m.nameEn}
                          {lang === "ka" && m.nameGe}
                          {lang === "ru" && m.nameRu}
                        </h3>
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
                          {lang === "ka" && product.productCountryGe}
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
                                      selectedCount.find(
                                        (sc) => sc.sId === s.id
                                      ).selectedCount}
                                    &#8382;
                                  </span>
                                  <span className={styles.old}>
                                    {s.price *
                                      selectedCount.find(
                                        (sc) => sc.sId === s.id
                                      ).selectedCount}
                                    &#8382;
                                  </span>
                                </div>
                              ) : (
                                <div>
                                  <span className={styles.price}>
                                    {s.price *
                                      selectedCount.find(
                                        (sc) => sc.sId === s.id
                                      ).selectedCount}
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
                          <span
                            key={d.id}
                            className={styles.descriptionContent}
                          >
                            {lang === "en" && d.descriptionEn}
                            {lang === "ka" && d.descriptionGe}
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
    </>
  );
};

export default ProductDetail;
