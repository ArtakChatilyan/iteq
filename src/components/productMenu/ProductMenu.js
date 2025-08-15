import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import styles from "./ProductMenu.module.css";
import "./styleExtra.css";

import ProductCard from "./productCard/ProductCard";
import { Link } from "react-router-dom";

const ProductMenu = ({ title, products }) => {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 8000,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
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
        <Slider {...settings}>
          {products.map((p) => (
            <ProductCard key={p.id} product={p} styles={{ margin: "0 auto" }} />
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default ProductMenu;
