import { useEffect, useState } from "react";
import { categoryAPI } from "../dalUser/userApi";
import Category from "./Category";
import { useNavigate, useParams } from "react-router-dom";

const CategoryContainer = () => {
  const urlCategory = useParams().categoryId;
  const urlBrands = useParams().brands;
  const urlMinPrice = useParams().minPrice;
  const urlMaxPrice = useParams().maxPrice;
  const urlPage = useParams().page;

  const [seoCategory, setSeoCategory]=useState(null);
  const {lang}=useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [categoryList, setCategoryist] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [selectedBrands, SetSelectedBrands] = useState(urlBrands.split("_").map(Number));

  const [productList, SetProductList] = useState([]);
  const [perPage, SetPerPage] = useState(9);
  const [total, SetTotal] = useState(0);

  const [dbMinPrice, setDBMinPrice] = useState(0);
  const [dbMaxPrice, setDBMaxPrice] = useState(0);
  const [minPrice, setMinPrice] = useState(urlMinPrice);
  const [maxPrice, setMaxPrice] = useState(urlMaxPrice);

  useEffect(() => {
    if (urlCategory) {
      LoadBrands(urlCategory);
      LoadCategories();
    }
  }, [urlCategory]);

  useEffect(() => {
    setMinPrice(urlMinPrice);
    setMaxPrice(urlMaxPrice);
  }, [urlMinPrice, urlMaxPrice]);

  useEffect(() => {
    SetSelectedBrands(urlBrands.split("_").map(Number));
  }, [urlBrands]);

  const LoadCategories = () => {
    categoryAPI
      .getCategories()
      .then((response) => {
        setSeoCategory(response.data.categories.filter(c=>c.id==urlCategory)[0]);
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

        let searchId = urlCategory;
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

  useEffect(() => {
    LoadProducts(
      urlCategory,
      urlPage,
      perPage,
      urlBrands,
      urlMinPrice,
      urlMaxPrice
    );
  }, [urlCategory, urlBrands, urlMinPrice, urlMaxPrice, urlPage]);

  const SelectBrands = (e, id) => {
    if (e.currentTarget.checked) {
      SetSelectedBrands((selectedBrands) => [...selectedBrands, id]);
    } else {
      SetSelectedBrands((selectedBrands) => [
        ...selectedBrands.filter((b) => b != id),
      ]);
    }
  };

  const chnageMinPrice = (newValue) => {
    setMinPrice(newValue);
  };

  const chnageMaxPrice = (newValue) => {
    setMaxPrice(newValue);
  };

  const searchHandler = () => {
    return navigate(
      `/${lang}/category/${urlCategory}/${selectedBrands.join(
        "_"
      )}/${minPrice}/${maxPrice}/${1}`
    );
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

        if (urlMinPrice == -1) setMinPrice(response.data.minPrice);
        if (urlMaxPrice == -1) setMaxPrice(response.data.maxPrice);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const pagingHandler = (pageNumber) => {
    return navigate(
      `/${lang}/category/${urlCategory}/${urlBrands}/${minPrice}/${maxPrice}/${pageNumber}`
    );
  };

  return (
    <Category
      loading={loading}
      selectedCategory={urlCategory}
      categoryList={categoryList}
      brandList={brandList}
      selectedBrands={selectedBrands}
      SelectBrands={SelectBrands}
      productList={productList}
      currentPage={urlPage}
      perPage={perPage}
      total={total}
      setNewPage={pagingHandler}
      dbMinPrice={dbMinPrice}
      dbMaxPrice={dbMaxPrice}
      minPrice={minPrice}
      maxPrice={maxPrice}
      chnageMinPrice={chnageMinPrice}
      chnageMaxPrice={chnageMaxPrice}
      search={searchHandler}
      seoCategory={seoCategory}
    />
  );
};

export default CategoryContainer;
