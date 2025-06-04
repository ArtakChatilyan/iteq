import { useEffect, useState } from "react";
import styles from "./PortfolioPublic.module.css";
import { portfolioAPI } from "../dalUser/userApi";
import { Link } from "react-router-dom";
import Paging from "../paging/Paging";

const PortfolioPublic = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(9);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState();

  useEffect(() => {
    LoadPortfolio(currentPage, perPage);
  }, [currentPage]);

  const LoadPortfolio = (page, count) => {
    portfolioAPI.getPortfolio(page, count).then((response) => {
      console.log(response);
      setData(response.data.data);
      setTotal(response.data.total);
    });
  };

  const pagingHandler = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <div className={styles.block}>
      <div className={styles.data}>
        {data &&
          data.map((d) => (
            <div key={d.id} className={styles.card}>
              <img src={d.imgUrl} className={styles.img} />

              <Link className={styles.title} to={`/portfolio/${d.id}`}>
                {d.titleEn}
              </Link>
            </div>
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

export default PortfolioPublic;
