import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import styles from "./Slider.module.css";
import "./styleExtra.css";

const Slider = ({ items }) => {
  
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <Carousel
      responsive={responsive}
      showDots={true}
      autoPlay={true}
      autoPlaySpeed={30000}
      keyBoardControl={true}
      infinite={true}
    >
      {items.map((url) => (
        <div>
          <img key={url} src={url} className={styles.sliderItem} />
        </div>
      ))}
    </Carousel>
  );
};

export default Slider;
