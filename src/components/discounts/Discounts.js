import { NavLink } from "react-router-dom";
import styles from "./Discounts.module.css";
import ProductCard from "../productMenu/productCard/ProductCard";
import Paging from "../paging/Paging";
import { useEffect, useState } from "react";
import { categoryAPI } from "../dalUser/userApi";
import LoadingScreen from "../loadingScreen/LoadingScreen";

const Discounts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(9);
  const [total, setTotal] = useState(0);
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    LoadDiscounts(currentPage, perPage);
  }, [currentPage]);

  const pagingHandler = (pageNumber) => {
    setCurrentPage(pageNumber);
    setLoading(true);
  };

  const LoadDiscounts = (page, count) => {
    categoryAPI
      .getDiscounts(page, count)
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
      {loading && <LoadingScreen showGif={true}/>}
      <div className={styles.content}>
        {productList.map((p) => (
          <NavLink to={`/product/${p.id}`} target="blank">
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

export default Discounts;
