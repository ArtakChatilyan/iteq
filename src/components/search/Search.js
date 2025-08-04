import { NavLink, useLocation, useParams } from "react-router-dom";
import styles from "./Search.module.css";
import Paging from "../paging/Paging";
import { useEffect, useState } from "react";
import ProductCard from "../productMenu/productCard/ProductCard";
import { categoryAPI } from "../dalUser/userApi";

const Search = () => {
  const { searchItem, searchType } = useParams();
  let location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(9);
  const [total, setTotal] = useState(0);

  const [productList, setProductList] = useState([]);

  const pagingHandler = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    if (searchType === "brand") {
      SearchByBrand(searchItem, currentPage, perPage);
    }
    if (searchType === "model") {
      SearchByModel(searchItem, currentPage, perPage);
    }

    if(searchType==="category"){
      SearchByCategory(searchItem, currentPage, perPage);
    }
  }, [currentPage, location]);

  const SearchByBrand = (term, page, perpage) => {
       
    categoryAPI.getProductsByBrand(term, page, perpage).then((response) => {
      setTotal(response.data.total);
      setProductList(response.data.products);
    });
  };

  const SearchByModel = (term, page, perpage) => {
    categoryAPI.getProductsByModel(term, page, perpage).then((response) => {
      setTotal(response.data.total);
      setProductList(response.data.products);
    });
  };

  const SearchByCategory = (term, page, perpage) => {
    categoryAPI.getProductsByCategory(term, page, perpage).then((response) => {
      console.log(response);
      
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
