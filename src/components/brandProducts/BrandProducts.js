import { NavLink, useParams } from "react-router-dom";
import styles from "./BrandProducts.module.css";
import ProductCard from "../productMenu/productCard/ProductCard";
import Paging from "../paging/Paging";
import { useEffect, useState } from "react";
import { categoryAPI } from "../dalUser/userApi";
import LoadingScreen from "../loadingScreen/LoadingScreen";

const BrandProducts = () => {
  const { brandId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(9);
  const [total, setTotal] = useState(0);
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [brand, setBrand] = useState(null);

  useEffect(() => {
    if (brandId)
      categoryAPI
        .getBrandById(brandId)
        .then((response) => {
          setBrand(response.data.brand);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          
        });
  }, [brandId]);

  useEffect(() => {
    LoadProducts(brandId, currentPage, perPage);
  }, [currentPage]);

  const pagingHandler = (pageNumber) => {
    setCurrentPage(pageNumber);
    setLoading(true);
  };

  const LoadProducts = (brandId, page, count) => {
    categoryAPI
      .getBrandProducts(brandId, page, count)
      .then((response) => {
        setTotal(response.data.total);
        setProductList(response.data.products);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className={styles.block}>
      {loading && <LoadingScreen showGif={true} />}
      {brand && <img src={brand.imgUrl} className={styles.logo}/>}
      <div className={styles.content}>
        {productList.map((p) => (
          <NavLink key={`nl${p.id}`} to={`/product/${p.id}`} target="blank">
            <ProductCard key={p.id} product={p} />
          </NavLink>
        ))}
      </div>

      <div style={{ margin: "20px" }}>
        <Paging
          mode="user"
          totalCount={total}
          currentPage={currentPage}
          pageSize={perPage}
          paging={pagingHandler}
        />
      </div>
    </div>
  );
};

export default BrandProducts;
