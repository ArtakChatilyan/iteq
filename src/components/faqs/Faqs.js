import { useEffect, useState } from "react";
import { faqsAPI } from "../dalUser/userApi";
import Paging from "../paging/Paging";
import LoadingScreen from "../loadingScreen/LoadingScreen";
import styles from "./Faqs.module.css";
import FaqsCard from "./FaqsCard";

const Faqs = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(9);
  const [total, setTotal] = useState(0);
  const [faqsList, setFaqsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    LoadFaqs(currentPage, perPage);
  }, [currentPage]);

  const LoadFaqs = (page, count) => {
    setLoading(true);
    faqsAPI
      .getFaqs(page, count)
      .then((response) => {
        setFaqsList(response.data.faqs);
        setTotal(response.data.total);
        console.log(response);
        
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const pagingHandler = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return <div><div className={styles.block}>
      {loading && <LoadingScreen showGif={true} />}
      {faqsList.map((fs) => (
        <FaqsCard key={fs.id} faqs={fs} />
      ))}
      {total > 0 && (
        <Paging
          mode="user"
          totalCount={total}
          currentPage={currentPage}
          pageSize={perPage}
          paging={pagingHandler}
        />
      )}
    </div></div>;
};

export default Faqs;
