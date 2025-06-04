import styles from "../View.module.css";
import { useEffect, useState } from "react";
import { subcategoryAPI } from "../../dal/api";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Paging from "../../../paging/Paging";
import SplashScreen from "../splashscreen/SplashScreen";

const SubCategories = () => {
  const { parentId } = useParams();
  const [parents, setParents] = useState([]);
  const [loading, setLoading]=useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const [modal, setModal] = useState(false);
  const [deleteId, setDeleteId] = useState(0);

  useEffect(() => {
    getParents(parentId);
    getSubCategories(parentId, currentPage, perPage);
  }, [location.pathname]);

  const pagingHandler = (pageNumber) => {
    setLoading(true);
    getSubCategories(parentId, pageNumber, perPage);
  };

  const getSubCategories = (parentId, currentPage, perPage) => {
    subcategoryAPI
      .getSubCategories(parentId, currentPage, perPage)
      .then((response) => {
        if (response) {
          setData(response.data.data);
          setTotal(response.data.total);
          setCurrentPage(currentPage);
        }
        setLoading(false);
      });
  };

  const getParents = (id) => {
    subcategoryAPI.getParents(id).then((response) => {
      console.log(response);
      
      if (response) {
        setParents(response.data.result.reverse());
      }
    });
  };

  const deleteItem = (id) => {
    setLoading(true);
    subcategoryAPI.deleteSubCategory(id).then((response) => {
      window.location.reload(false);
    });
  };

  return (
    <div className={styles.data}>
      {loading && <SplashScreen />}
      <table className={styles.table}>
        <thead>
          <tr>
            <th colSpan={6}>
              {parents
                ? parents.map((p) => (
                    <Link key={`l${p.id}`}
                      to={`/admin/subCategories/${p.id}`}
                      style={{
                        marginRight: "20px",
                        fontSize: "1.6rem",
                        fontFamily: "SourceSansLight",
                        textDecoration: "underline",
                      }}
                    >
                      {p.name}
                    </Link>
                  ))
                : ""}
            </th>
          </tr>
          <tr>
            <th>name(english)</th>
            <th>name(georgian)</th>
            <th>name(russian)</th>
            <th>parent category</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((d) => (
              <tr key={`l${d.id}`} className={styles.item}>
                <td>
                  <Link to={`/admin/subCategories/${d.id}`}>{d.nameEn}</Link>
                </td>
                <td>{d.nameGe}</td>
                <td>{d.nameRu}</td>
                <td>{d.parent}</td>

                <td>
                  <Link
                    to={`/admin/editSubCategory/${d.id}`}
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
              <td colSpan={6}>no data to preview</td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td>
              <Link
                to={`/admin/addSubCategory/${parentId}`}
                style={{ textDecoration: "underline", color: "#7dacee" }}
              >
                add
              </Link>
            </td>
            <td colSpan={6}>
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
    </div>
  );
};

export default SubCategories;
