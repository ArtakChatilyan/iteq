import styles from "../View.module.css";
import { categoryAPI } from "../../dal/api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import Paging from "../../../paging/Paging";
import SplashScreen from "../splashscreen/SplashScreen";
import BrandsForCategories from "./BrandsForCategories/BrandsForCategories";

const MainCategories = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const [modal, setModal] = useState(false);
  const [deleteId, setDeleteId] = useState(0);
  const [modalBrands, setModalBrands] = useState(false);
  const [catId, setCatId] = useState(0);
  const [catTitle, setCatTitle] = useState("");

  useEffect(() => {
    getCategories(currentPage, perPage);
  }, []);

  const pagingHandler = (pageNumber) => {
    setLoading(true);
    getCategories(pageNumber, perPage);
  };

  const getCategories = (currentPage, perPage) => {
    categoryAPI
      .getCategories(currentPage, perPage)
      .then((response) => {
        setData(response.data.data);
        setTotal(response.data.total);
        setCurrentPage(currentPage);
      })
      .catch((error) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  const deleteItem = (id) => {
    setLoading(true);
    categoryAPI.deleteCategory(id).then((response) => {
      window.location.reload(false);
    });
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  Modal.setAppElement("#root");

  return (
    <div className={styles.data}>
      {loading && <SplashScreen />}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>name(english)</th>
            <th>name(georgian)</th>
            <th>name(russian)</th>
            <th>image</th>
            <th>order</th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((d) => (
              <tr className={styles.item} key={`tr${d.id}`}>
                <td>{d.nameEn}</td>
                <td>{d.nameGe}</td>
                <td>{d.nameRu}</td>
                <td>
                  <img src={d.imgUrl} className={styles.img} />
                </td>
                <td>{d.categoryOrder}</td>
                <td>
                  <Link to={`/admin/subCategories/${d.id}`}>subcategories</Link>
                </td>
                <td>
                  <button
                    className={styles.btn}
                    style={{ fontSize: "1.6rem" }}
                    onClick={() => {
                      setCatId(d.id);
                      setCatTitle(d.nameEn);
                      setModalBrands(true);
                    }}
                  >
                    brands
                  </button>
                </td>
                <td>
                  <Link
                    to={`/admin/editCategory/${d.id}`}
                    className={styles.btn}
                  >
                    edit
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
                    delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td>no data to preview</td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td>
              <Link
                to={`/admin/addCategory`}
                style={{ textDecoration: "underline", color: "#7dacee" }}
              >
                add
              </Link>
            </td>
            <td colSpan={8}>
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
              delete
            </button>
            <button className={styles.delBtn} onClick={() => setModal(false)}>
              cancel
            </button>
          </div>
        </div>
      )}
      <Modal
        isOpen={modalBrands}
        style={{
          overlay: {
            backgroundColor: "rgba(255,255,255,.8)",
          },
          content: {
            color: "lightsteelblue",
            backgroundColor: "rgb(32,32,32)",
          },
        }}
      >
        <BrandsForCategories
          categoryId={catId}
          categoryTitle={catTitle}
          closeModal={() => {
            setModalBrands(false);
          }}
        />
      </Modal>
    </div>
  );
};

export default MainCategories;
