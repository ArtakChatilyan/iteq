import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { categoryAPI } from "../dalUser/userApi";
import Category from "./Category";
import { setCategory } from "../../redux-store/filterSlice";
import { useParams } from "react-router-dom";

const CategoryContainer = () => {
  const selectedCategory = useParams().categoryId;

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [filterMode, SetFilterMode] = useState(
    screenWidth > 1024 ? true : false
  );
  const handleResize = () => {
    setScreenWidth(window.innerWidth);
    SetFilterMode(window.innerWidth > 1024 ? true : false);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // const dispatch = useDispatch();
  // const selectedCategory = useSelector(
  //   (state) => state.filterReducer.selectedCategory
  // );

  const [loading, setLoading] = useState(true);
  const [categoryList, setCategoryist] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [selectedBrands, SetSelectedBrands] = useState([]);

  const [productList, SetProductList] = useState([]);
  const [currentPage, SetCurrentPage] = useState(1);
  const [perPage, SetPerPage] = useState(9);
  const [total, SetTotal] = useState(0);

  const [dbMinPrice, setDBMinPrice] = useState(0);
  const [dbMaxPrice, setDBMaxPrice] = useState(0);
  const [minPrice, setMinPrice] = useState(-1);
  const [maxPrice, setMaxPrice] = useState(-1);

  const chnageMinPrice = (newValue) => {
    setMinPrice(newValue);
  };

  const chnageMaxPrice = (newValue) => {
    setMaxPrice(newValue);
  };

  const priceHandler = () => {
    
    setLoading(true);
    LoadProducts(
      selectedCategory,
      currentPage,
      perPage,
      selectedBrands,
      minPrice,
      maxPrice
    );
  };

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

  // const SetCategory = (categoryId) => {
  //   if (window.innerWidth <= 1024) SetFilterMode(false);
  //   if (categoryId === selectedCategory) return;
  //   setLoading(true);
  //   // setCurrentPage(1);
  //   // setMinPrice(-1);
  //   // setMaxPrice(-1);
  //   //dispatch(setCategory({ selectedCategory: categoryId }));
  // };

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

  const SelectBrands = (e, id) => {
    //if (window.innerWidth <= 1024) SetFilterMode(false);
    setLoading(true);
    SetCurrentPage(1);
    if (e.currentTarget.checked) {
      SetSelectedBrands((brands) => [...brands, id]);
    } else {
      SetSelectedBrands((brands) => [...brands.filter((b) => b != id)]);
    }
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
        SetProductList(response.data.products);
        SetTotal(response.data.total);

        setDBMinPrice(response.data.minPrice);
        setDBMaxPrice(response.data.maxPrice);

        if (minPrice === -1) setMinPrice(response.data.minPrice);
        if (maxPrice === -1) setMaxPrice(response.data.maxPrice);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        if (window.innerWidth <= 1024) SetFilterMode(false);
        setLoading(false);
      });
  };

  const pagingHandler = (pageNumber) => {
    setLoading(true);
    SetCurrentPage(pageNumber);
  };

  return (
    <Category
      loading={loading}
      selectedCategory={selectedCategory}
      filterMode={filterMode}
      setFilterMode={SetFilterMode}
      categoryList={categoryList}
      brandList={brandList}
      FilterByBrand={SelectBrands}
      productList={productList}
      currentPage={currentPage}
      perPage={perPage}
      total={total}
      setNewPage={pagingHandler}
      dbMinPrice={dbMinPrice}
      dbMaxPrice={dbMaxPrice}
      minPrice={minPrice}
      maxPrice={maxPrice}
      chnageMinPrice={chnageMinPrice}
      chnageMaxPrice={chnageMaxPrice}
      FilterByPrice={priceHandler}
    />
  );
};

export default CategoryContainer;
