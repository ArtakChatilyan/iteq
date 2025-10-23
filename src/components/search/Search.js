import { NavLink, useLocation, useParams } from "react-router-dom";
import styles from "./Search.module.css";
import Paging from "../paging/Paging";
import { useEffect, useState } from "react";
import ProductCard from "../productMenu/productCard/ProductCard";
import { categoryAPI } from "../dalUser/userApi";

const Search = () => {
  const { searchItem } = useParams();
  let location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(9);
  const [total, setTotal] = useState(0);

  const [productList, setProductList] = useState([]);

  const pagingHandler = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    if (searchItem) SearchProducts(searchItem, currentPage, perPage);
  }, [currentPage, location]);

  const SearchProducts = (term, page, perPage) => {
    categoryAPI
      .searchProductsByGeneral(term, page, perPage)
      .then((response) => {
        setTotal(response.data.total);
        setProductList(response.data.products);
      });
  };

  return (
    <div className={styles.block}>
      <div className={styles.searchInfo}>search result for '{searchItem}'</div>
      <div className={styles.content}>
        {productList.map((p) => (
          <NavLink to={`/product/${p.id}`} target="blank">
            <ProductCard key={p.id} product={p} />
          </NavLink>
        ))}
      </div>
      {total > 0 && (
        <div>
          <Paging
            mode="user"
            totalCount={total}
            currentPage={currentPage}
            pageSize={perPage}
            paging={pagingHandler}
          />
        </div>
      )}
    </div>
  );
};

export default Search;
