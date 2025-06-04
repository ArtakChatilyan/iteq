import { useEffect, useState } from "react";
import styles from "./PartnersPublic.module.css";
import { partnersAPI } from "../dalUser/userApi";
import Paging from "../paging/Paging";
import { Link } from "react-router-dom";

const PartnersPublic = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState();

  useEffect(() => {
    LoadPartners(currentPage, perPage);
  }, [currentPage]);

  const LoadPartners = (page, count) => {
    partnersAPI.getPartners(page, count).then((response) => {
      
      setData(response.data.data);
      setTotal(response.data.total.total);
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
              <div className={styles.title}>
                <Link
                  to={d.partnerUrl}
                  target="_blank"
                  className={styles.title}
                >
                  {d.name}
                </Link>
              </div>
              <div
                className={styles.content}
                dangerouslySetInnerHTML={{ __html: d.contentEn }}
              />
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

export default PartnersPublic;
