import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import styles from "./BrandMenu.module.css";
import "./styleExtra.css";
import BrandCard from "./brandcard/BrandCard";

const BrandMenu = ({ brands }) => {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
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
        <Slider {...settings}>
          {brands.map((b) => (
            <div>
              <BrandCard key={b.id} brand={b} styles={{ margin: "0 auto" }} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default BrandMenu;
