import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import styles from "./ProductMenu.module.css";
import "./styleExtra.css";

import ProductCard from "./productCard/ProductCard";
import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

const ProductMenu = ({ title, products }) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const handleResize = () => {
    setScreenWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [sliderConfig, setSliderConfig] = useState(0);

  useEffect(() => {
    if (
      products.length === 1 ||
      (products.length === 2 && screenWidth >= 1200) ||
      (products.length === 3 && screenWidth >= 1500) ||
      (products.length === 4 && screenWidth >= 1700)
    )
      setSliderConfig(1);
    else setSliderConfig(0);
  }, [products, screenWidth]);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 8000,
    responsive: [
      {
        breakpoint: 1700,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1500,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className={styles.block}>
      <div className={styles.slideContainer}>
        <div className={styles.categoryTitle}>
          <Link to="/discounts">
            {" "}
            <h2 className={`${styles.hoverUnderlineAnimation} ${styles.left}`}>
              {title}
            </h2>
          </Link>
        </div>
        {sliderConfig === 1 && (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
            }}
          >
            {products.map((p) => (
              <NavLink to={`/product/${p.id}`} target="blank">
                <ProductCard key={p.id} product={p} withMargin={true} />
              </NavLink>
            ))}
          </div>
        )}

        {sliderConfig === 0 && (
          <Slider {...settings}>
            {products.map((p) => (
              <NavLink to={`/product/${p.id}`} target="blank">
                <ProductCard key={p.id} product={p} withMargin={false} />
              </NavLink>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
};

export default ProductMenu;
