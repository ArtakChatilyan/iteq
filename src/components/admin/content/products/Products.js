import styles from "../View.module.css";
import cssStyle from "./Search.module.css";
import search from "../../../../assets/iconSearch.svg";
import { categoryAPI, productsAPI, searchAPI } from "../../dal/api";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Paging from "../../../paging/Paging";
import SplashScreen from "../splashscreen/SplashScreen";
import { useTranslation } from "react-i18next";

const Products = () => {
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const { page, sType, sTerm, sCat } = useParams();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(parseInt(page || 1));
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const [modal, setModal] = useState(false);
  const [deleteId, setDeleteId] = useState(0);

  const [selectedCategory, setSelectedCategory] = useState(sCat);
  const [searchItem, setSearchItem] = useState(sTerm || "");
  const [searchType, setSearchType] = useState(sType || "default");
  const [searchData, setSearchData] = useState([]);

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (sCat) getBrands(sCat);
  }, [sCat]);

  const getCategories = () => {
    categoryAPI
      .getMainCategories()
      .then((response) => {
        setCategories(response.data.data);
      })
      .catch((error) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  const getBrands = (catId) => {
    categoryAPI
      .getCategoryBrands(catId)
      .then((response) => {
        setBrands(response.data.data);
      })
      .catch((error) => console.log(error))
      .finally(() => {});
  };

  useEffect(() => {
    //getCategories();
    if(sCat)
    getProducts(searchType, searchItem, currentPage, perPage);
  }, [currentPage]);

  const pagingHandler = (pageNumber) => {
    setLoading(true);
    setCurrentPage(pageNumber);
    getProducts(searchType, searchItem, pageNumber, perPage);
  };

  const getProducts = (sType, sItem, currentPage, perPage) => {
    setLoading(true);
    if (sType === "brand") {
      searchAPI
        .getProductsByBrand(sItem, currentPage, perPage)
        .then((response) => {
          setTotal(response.data.total);
          setProducts(response.data.products);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (sType === "model") {
      searchAPI
        .getProductsByModel(sItem, currentPage, perPage)
        .then((response) => {
          setTotal(response.data.total);
          setProducts(response.data.products);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      productsAPI
        .getProducts(currentPage, perPage)
        .then((response) => {
          if (response) {
            setProducts(response.data.data);
            setTotal(response.data.total);
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const deleteItem = (id) => {
    setModal(false);
    setLoading(true);
    productsAPI
      .deleteProduct(id)
      .then((response) => {
        if (products.length === 1) {
          if (currentPage > 1) setCurrentPage((currentPage) => currentPage - 1);
        } else {
          getProducts(searchType, searchItem, currentPage, perPage);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const searchTextChange = (searchText) => {
    setSearchItem(searchText);
    if (searchText) {
      if (searchType === "brand") {
        searchAPI.searchByBrand(searchText).then((response) => {
          setSearchData(response.data.map((bd) => ({ text: bd.brandName })));
        });
      } else if (searchType === "model") {
        searchAPI.searchByModel(searchText).then((response) => {
          setSearchData(response.data.map((md) => ({ text: md.nameEn })));
        });
      }
    } else {
      setSearchData([]);
    }
  };

  const searchHandle = () => {
    setLoading(true);
    if (currentPage === 1) {
      getProducts(searchType, searchItem, currentPage, perPage);
    } else {
      setCurrentPage(1);
    }
  };
  return (
    <div className={styles.data}>
      {loading && <SplashScreen />}
      <div className={cssStyle.searchGroup}>
        <div className={cssStyle.inputGroup}>
          <input
            type="text"
            placeholder={t("search")}
            className={cssStyle.input}
            value={searchItem}
            onChange={(e) => searchTextChange(e.currentTarget.value)}
          />
          <span className={cssStyle.icon}>
            <img src={search} onClick={searchHandle} />
          </span>
        </div>

        {searchData.length > 0 && (
          <ul className={cssStyle.autofill}>
            {searchData.map((sd, index) => (
              <li
                key={`sd${index}`}
                className={cssStyle.afItem}
                onClick={(e) => {
                  setSearchItem(e.currentTarget.innerText);
                  setSearchData([]);
                }}
              >
                {sd.text}
              </li>
            ))}
          </ul>
        )}
        <div className={cssStyle.selectGroup}>
          <input
            type="radio"
            value="default"
            name="searchType"
            checked={searchType === "default"}
            onChange={(e) => {
              setSearchType(e.currentTarget.value);
            }}
          />{" "}
          {t("admin_byDefault")}
          <input
            type="radio"
            value="brand"
            name="searchType"
            checked={searchType === "brand"}
            onChange={(e) => {
              setSearchType(e.currentTarget.value);
            }}
          />{" "}
          {t("admin_byBrand")}
          <input
            type="radio"
            value="model"
            name="searchType"
            checked={searchType === "model"}
            onChange={(e) => {
              setSearchType(e.currentTarget.value);
            }}
          />{" "}
          {t("admin_byModel")}
        </div>
      </div>

      <div className={cssStyle.itemContent}>
        {categories.map((cat) => (
          <div
            key={`cat${cat.id}`}
            className={cssStyle.categoryItem}
            onClick={() => {
              setSelectedCategory(cat.id);
              getBrands(cat.id);
              setProducts([]);
              setCurrentPage(1);
            }}
          >
            {cat.nameEn}
          </div>
        ))}
      </div>
      <div className={cssStyle.itemContent}>
        {brands.map((br) => (
          <div
            key={`br${br.id}`}
            className={`${cssStyle.categoryItem} ${cssStyle.brandItem}`}
            onClick={() => {
              setLoading(true);
              setSearchType("brand");
              setSearchItem(br.brandName);
              setCurrentPage(1);
              getProducts("brand", br.brandName, 1, perPage);
            }}
          >
            {br.brandName}
          </div>
        ))}
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th></th>
            <th>{t("admin_name")}</th>
            <th>{t("admin_models")}</th>
            <th>{t("admin_image")}</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((d) => (
            <tr key={`tr${d.id}`} className={styles.item}>
              <td>{d.id}</td>
              <td>{d.productNameEn}</td>
              <td>
                {d.modelInfo &&
                  d.modelInfo.map((mi) => (
                    <div key={`mi${mi.id}`}>{mi.nameEn}</div>
                  ))}
              </td>

              <td>
                <img src={d.imgUrl} className={styles.img} />
              </td>
              <td>
                <Link
                  to={`/admin/editProduct/${d.id}/${currentPage}/${searchType}/${searchItem}/${selectedCategory}`}
                  className={styles.btn}
                >
                  {t("admin_edit")}
                </Link>
              </td>
              <td>
                <button
                  className={styles.btn}
                  onClick={() => {
                    setDeleteId(d.id);
                    setModal(true);
                  }}
                >
                  {t("admin_delete")}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>
              <Link
                to={`/admin/addProduct/${currentPage}/${searchType}/${searchItem}/${selectedCategory}`}
                style={{ textDecoration: "underline", color: "#7dacee" }}
              >
                {t("admin_add")}
              </Link>
            </td>
            <td colSpan={10}>
              <div style={{ textAlign: "right" }}>
                <Paging
                  totalCount={total}
                  currentPage={currentPage}
                  pageSize={perPage}
                  paging={pagingHandler}
                />
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
      {modal && (
        <div className={styles.modal}>
          <div className={styles.btnGroup}>
            <button
              className={styles.delBtn}
              onClick={() => {
                deleteItem(deleteId);
              }}
            >
              {t("admin_delete")}
            </button>
            <button className={styles.delBtn} onClick={() => setModal(false)}>
              {t("admin_cancel")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
