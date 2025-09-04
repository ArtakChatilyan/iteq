import { useDispatch, useSelector } from "react-redux";
import Category from "./Category";
import { useEffect, useState } from "react";
import LoadingScreen from "../loadingScreen/LoadingScreen";
import { categoryAPI } from "../dalUser/userApi";
import { setCategory } from "../../redux-store/filterSlice";

const CatgeoryContainer = ({ changeLanguage }) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const handleResize = () => {
    setScreenWidth(window.innerWidth);
    setFilterMode(window.innerWidth > 1024 ? true : false);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const selectedCategory = useSelector(
    (state) => state.filterReducer.selectedCategory
  );
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(9);
  const [total, setTotal] = useState(0);

  const [filterMode, setFilterMode] = useState(
    screenWidth > 1024 ? true : false
  );

  const [categoryList, setCategoryist] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [productList, setProductList] = useState([]);

  const [dbMinPrice, setDBMinPrice] = useState(0);
  const [dbMaxPrice, setDBMaxPrice] = useState(0);

  useEffect(() => {
    if (selectedCategory) {
      LoadBrands(selectedCategory);
      LoadCategories();
    }
  }, [selectedCategory]);

  useEffect(() => {
    LoadProducts(
      selectedCategory,
      currentPage,
      perPage,
      selectedBrands,
      minPrice,
      maxPrice
    );
  }, [selectedBrands, selectedCategory, currentPage]);

  const pagingHandler = (pageNumber) => {
    setLoading(true);
    setCurrentPage(pageNumber);
  };

  const priceHandler = () => {
    if (window.innerWidth <= 1024) setFilterMode(false);
    setLoading(true);
    setCurrentPage(1);
  };

  const SetCategory = (categoryId) => {
    if (window.innerWidth <= 1024) setFilterMode(false);
    if (categoryId === selectedCategory) return;
    setLoading(true);
    setCurrentPage(1);
    setMinPrice(-1);
    setMaxPrice(-1);
    dispatch(setCategory({selectedCategory:categoryId}));
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

        let searchId = selectedCategory;
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
    setLoading(true);
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
    if (window.innerWidth <= 1024) setFilterMode(false);
    setLoading(true);
    setCurrentPage(1);
    if (e.currentTarget.checked) {
      setSelectedBrands((brands) => [...brands, id]);
    } else {
      setSelectedBrands((brands) => [...brands.filter((b) => b != id)]);
    }
  };

  const [minPrice, setMinPrice] = useState(-1);
  const [maxPrice, setMaxPrice] = useState(-1);

  const chnageMinPrice = (newValue) => {
    setMinPrice(newValue);
  };

  const chnageMaxPrice = (newValue) => {
    setMaxPrice(newValue);
  };

  if (loading) {
    return <LoadingScreen showGif={true} />;
  }
  return (
    <Category
      categoryList={categoryList}
      brandList={brandList}
      selectedBrands={selectedBrands}
      productList={productList}
      SetCategory={SetCategory}
      FilterByBrand={addToSelected}
      FilterByPrice={priceHandler}
      currentPage={currentPage}
      perPage={perPage}
      total={total}
      setNewPage={pagingHandler}
      filterMode={filterMode}
      setFilterMode={setFilterMode}
      dbMinPrice={dbMinPrice}
      dbMaxPrice={dbMaxPrice}
      minPrice={minPrice}
      maxPrice={maxPrice}
      chnageMinPrice={chnageMinPrice}
      chnageMaxPrice={chnageMaxPrice}
    />
  );
};

export default CatgeoryContainer;
