import styles from "../View.module.css";
import { useEffect, useState } from "react";
import { clientAPI} from "../../dal/api";
import { Link, useLocation, useNavigate} from "react-router-dom";
import Paging from "../../../paging/Paging";
import SplashScreen from "../splashscreen/SplashScreen";

const Clients = () => {
  const [loading, setLoading]=useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getClients(currentPage, perPage);
  }, [currentPage]);

  const pagingHandler = (pageNumber) => {
    setLoading(true);
  };

  const getClients = (currentPage, perPage) => {
   
    
    clientAPI
      .getClients(currentPage, perPage)
      .then((response) => {
        if (response) {
          setData(response.data.users);
          setTotal(response.data.total);
        }
        setLoading(false);
      });
  };

  return (
    <div className={styles.data}>
      {loading && <SplashScreen />}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>email</th>
            <th>name</th>
            <th>phone</th>
            <th>orders</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((d) => (
              <tr key={`l${d.userId}`} className={styles.item}>
                <td>{d.email}</td>
                <td>{d.name}</td>
                <td>{d.phone}</td>

                <td>
                  <Link
                    to={'/'}
                    className={styles.btn}
                  >
                    orders
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>no clients data to preview</td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4}>
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
    </div>
  );
};

export default Clients;
