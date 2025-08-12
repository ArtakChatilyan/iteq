import { NavLink, useLocation, useParams } from "react-router-dom";
import styles from "./Category.module.css";
import { useContext, useEffect, useState } from "react";
import { categoryAPI } from "../dalUser/userApi";
import ProductCard from "../productMenu/productCard/ProductCard";
import Paging from "../paging/Paging";
import "react-range-slider-input/dist/style.css";
import "./extra.css";
import { LanguageContext } from "../../contexts/LanguageContext";
import LoadingScreen from "../loadingScreen/LoadingScreen";

const Category = () => {
  const params = useParams();
  const lang = useContext(LanguageContext);

  const location = useLocation();
  const [catId, setCatId] = useState(params.categoryId);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(9);
  const [total, setTotal] = useState(0);

  const [categoryList, setCategoryist] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [productList, setProductList] = useState([]);

  const [dbMinPrice, setDBMinPrice] = useState(0);
  const [dbMaxPrice, setDBMaxPrice] = useState(0);

  const [minPrice, setMinPrice] = useState(-1);
  const [maxPrice, setMaxPrice] = useState(-1);
  const [priceFilter, setPriceFilter] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCatId(params.categoryId);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setCatId(params.categoryId);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    LoadBrands(params.categoryId);
    LoadCategories();
  }, [catId]);

  useEffect(() => {
    LoadProducts(
      catId,
      currentPage,
      perPage,
      selectedBrands,
      minPrice,
      maxPrice
    );
  }, [selectedBrands, priceFilter, catId, currentPage]);

  const pagingHandler = (pageNumber) => {
    setLoading(true);
    setCurrentPage(pageNumber);
  };

  const priceHandler = () => {
    setLoading(true);
    setCurrentPage(1);
    setPriceFilter((p) => !p);
  };

  const LoadFilterCategory = (categoryId) => {
    if (catId === categoryId) return;
    setLoading(true);
    setCurrentPage(1);
    setMinPrice(-1);
    setMaxPrice(-1);
    setCatId(categoryId);
  };

  const LoadCategories = () => {
    categoryAPI
      .getCategories()
      .then((response) => {
        let result = [];
        for (let i = 0; i < response.data.categories.length; i++) {
          result.push({
            id: response.data.categories[i].id,
            titleEn: response.data.categories[i].nameEn,
            titleGe: response.data.categories[i].nameGe,
            titleRu: response.data.categories[i].nameRu,
            parentId: response.data.categories[i].parentId,
            categoryOrder: response.data.categories[i].categoryOrder,
            children: [],
          });
        }
        result.sort(function (a, b) {
          return a.parentId - b.parentId;
        });

        let searchId = catId;
        let searchParentId = result.find((c) => c.id == searchId).parentId;

        while (searchParentId > 0) {
          searchId = searchParentId;
          searchParentId = result.find((c) => c.id == searchId).parentId;
        }

        for (let i = result.length - 1; i > 0; i--) {
          if (result[i].parentId > 0) {
            result
              .find((c) => c.id === result[i].parentId)
              .children.unshift(result[i]);
            result
              .find((c) => c.id === result[i].parentId)
              .children.sort((a, b) => a.categoryOrder - b.categoryOrder);
          }
        }
        result = result
          .filter((c) => c.parentId === 0)
          .sort((a, b) => a.categoryOrder - b.categoryOrder);
        let searchResult = result.find((r) => r.id == searchId);

        if (searchResult.children.length > 0) {
          setCategoryist(searchResult.children);
        } else {
          setCategoryist([searchResult]);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {});
  };

  const LoadBrands = (catId) => {
    categoryAPI
      .getBrandsForCategory(catId)
      .then((response) => {
        setBrandList(response.data.brands);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {});
  };

  const LoadProducts = (
    categoryId,
    page,
    count,
    brandList,
    minPrice,
    maxPrice
  ) => {
    categoryAPI
      .getProducts(categoryId, page, count, brandList, minPrice, maxPrice)
      .then((response) => {
        setProductList(response.data.products);
        setTotal(response.data.total);

        setDBMinPrice(response.data.minPrice);
        setDBMaxPrice(response.data.maxPrice);

        if (minPrice === -1) setMinPrice(response.data.minPrice);
        if (maxPrice === -1) setMaxPrice(response.data.maxPrice);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const addToSelected = (e, id) => {
    setLoading(true);
    setCurrentPage(1);
    if (e.currentTarget.checked) {
      setSelectedBrands((brands) => [...brands, id]);
    } else {
      setSelectedBrands((brands) => [...brands.filter((b) => b != id)]);
    }
  };

  const chnageMinPrice = (newValue) => {
    setMinPrice(newValue);
  };

  const chnageMaxPrice = (newValue) => {
    setMaxPrice(newValue);
  };

  return (
    <div className={styles.block}>
      {loading && <LoadingScreen showGif={true} />}
      <div className={styles.filter}>
        <Menu
          items={categoryList}
          selectItems={LoadFilterCategory}
          lang={lang}
        />

        <span className={styles.partTitle}>Brands</span>
        <ul className={styles.list}>
          {brandList.map((b) => (
            <li key={`chk${b.brandId}`}>
              <input
                type="checkbox"
                style={{
                  width: "16px",
                  height: "16px",
                  cursor: "pointer",
                  marginRight: "8px",
                  backgroundColor: "red",
                }}
                onChange={(e) => addToSelected(e, b.brandId)}
              />
              {b.brandName}
            </li>
          ))}
        </ul>

        <span className={styles.partTitle}>Price range</span>
        <div style={{ marginTop: "6px" }}>
          <table>
            <tbody>
              <tr>
                <td className={styles.label}>
                  <span>{dbMinPrice}</span>
                </td>
                <td className={styles.label}>
                  <span>-</span>
                </td>
                <td className={styles.label}>
                  <span>
                    <span className={styles.label}>{dbMaxPrice}</span>
                    <span className={styles.label}>&#8382; </span>
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <input
                    type="text"
                    value={minPrice}
                    className={styles.input}
                    onChange={(e) => chnageMinPrice(e.target.value)}
                    onBlur={priceHandler}
                  />
                </td>
                <td>
                  <span className={styles.label}>-</span>
                </td>
                <td>
                  <input
                    type="text"
                    value={maxPrice}
                    className={styles.input}
                    onChange={(e) => chnageMaxPrice(e.target.value)}
                    onBlur={priceHandler}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          {/* <div
            style={{ display: "flex", justifyContent: "space-between" }}
          ></div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span className={styles.label}>-</span>
          </div> */}
          {/* <RangeSlider
            min={sliderMin}
            max={sliderMax}
            value={[priceMin, priceMax]}
            step={1}
            onInput={(e) => {
              setPriceMin(e[0]);
              setPriceMax(e[1]);
            }}
            onThumbDragEnd={priceHandler}
            onRangeDragEnd={priceHandler}
          /> */}
        </div>
      </div>

      <div className={styles.content}>
        {productList.map((p) => (
          <NavLink to={`/product/${p.id}`} target="blank">
            <ProductCard key={p.id} product={p} />
          </NavLink>
        ))}
      </div>

      <div style={{ gridColumn: "2 / 3", margin: "10px" }}>
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

export default Category;

function Menu({ items, selectItems, lang }) {
  const [displayChildren, setDisplayChildren] = useState({});
  return (
    <ul className={`${styles.list} ${styles.listLeft}`}>
      {items.map((item) => {
        let titleValue = "";
        if (lang === "en") titleValue = item.titleEn;
        else if (lang === "ge") titleValue = item.titleGe;
        else titleValue = item.titleRu;
        return (
          <li key={item.id}>
            <span
              className={`${styles.title} ${styles.hoverUnderlineAnimation} ${styles.left}`}
              onClick={() => {
                selectItems(item.id);
              }}
            >
              {titleValue}
            </span>{" "}
            {item.children.length > 0 && (
              <button
                className={styles.arrow}
                onClick={() => {
                  setDisplayChildren({
                    ...displayChildren,
                    [item.titleEn]: !displayChildren[item.titleEn],
                  });
                }}
              >
                {displayChildren[item.titleEn] ? (
                  <span className={styles.opened}>&gt;</span>
                ) : (
                  <span className={styles.closed}>&gt;</span>
                )}
              </button>
            )}
            {displayChildren[item.titleEn] && item.children && (
              <Menu
                items={item.children}
                selectItems={selectItems}
                lang={lang}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}
