import { Link, NavLink, useLocation, useParams } from "react-router-dom";
import styles from "./Category.module.css";
import { Children, useContext, useEffect, useState } from "react";
import { categoryAPI } from "../dalUser/userApi";
import ProductCard from "../productMenu/productCard/ProductCard";
import Paging from "../paging/Paging";
import RangeSlider from "react-range-slider-input";
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

  const [sliderMin, setSliderMin] = useState(0);
  const [sliderMax, setSliderMax] = useState(0);

  const [priceMin, setPriceMin] = useState(-1);
  const [priceMax, setPriceMax] = useState(-1);
  const [priceFilter, setPriceFilter] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    LoadBrands();
    setCatId(params.categoryId);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setCatId(params.categoryId);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    LoadCategories();
  }, [catId]);

  useEffect(() => {
    LoadProducts(
      catId,
      currentPage,
      perPage,
      selectedBrands,
      priceMin,
      priceMax
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
    if(catId===categoryId)
      return;
    setLoading(true);
    setCurrentPage(1);
    setPriceMin(-1);
    setPriceMax(-1);
    setCatId(categoryId);
  };

  const LoadCategories = () => {
    categoryAPI.getCategories().then((response) => {
      let result = [];
      for (let i = 0; i < response.data.categories.length; i++) {
        result.push({
          id: response.data.categories[i].id,
          titleEn: response.data.categories[i].nameEn,
          titleGe: response.data.categories[i].nameGe,
          titleRu: response.data.categories[i].nameRu,
          parentId: response.data.categories[i].parentId,
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
        }
      }
      result = result.filter((c) => c.parentId === 0);
      let searchResult = result.find((r) => r.id == searchId);

      if (searchResult.children.length > 0) {
        setCategoryist(searchResult.children);
      } else {
        setCategoryist([searchResult]);
      }
    }).catch((error) => {
        console.log(error);
      })
      .finally(() => {});
  };

  const LoadBrands = () => {
    categoryAPI
      .getBrands()
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

        setSliderMin(response.data.minPrice);
        setSliderMax(response.data.maxPrice);

        if (minPrice === -1) setPriceMin(response.data.minPrice);
        if (maxPrice === -1) setPriceMax(response.data.maxPrice);
      }).catch((error) => {
        console.log(error);
      })
      .finally(() => {setLoading(false)});
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

  return (
    <div className={styles.block}>
      {loading && <LoadingScreen showGif={true}/>}
      <div className={styles.filter}>
        <Menu
          items={categoryList}
          selectItems={LoadFilterCategory}
          lang={lang}
        />

        <span className={styles.partTitle}>Brands</span>
        <ul className={styles.list}>
          {brandList.map((b) => (
            <li key={`chk${b.id}`}>
              <input
                type="checkbox"
                style={{
                  width: "16px",
                  height: "16px",
                  cursor: "pointer",
                  marginRight: "8px",
                  backgroundColor: "red",
                }}
                onChange={(e) => addToSelected(e, b.id)}
              />
              {b.brandName}
            </li>
          ))}
        </ul>

        <span className={styles.partTitle}>Price range</span>
        <div style={{ marginTop: "6px" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <span className={styles.sliderValue}>{priceMin}</span>
            <span className={styles.sliderValue}>-</span>
            <span className={styles.sliderValue}>{priceMax}</span>
            <span className={styles.sliderValue}>&#8382; </span>
          </div>
          <RangeSlider
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
          />
        </div>
      </div>

      <div className={styles.content}>
        {productList.map((p) => (
          <NavLink to={`/product/${p.id}`}>
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
              className={`${styles.title } ${styles.hoverUnderlineAnimation} ${styles.left}`}
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
