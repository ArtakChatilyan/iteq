import { useEffect, useState } from "react";
import { categoryAPI } from "../dalUser/userApi";
import styles from "./Story.module.css";
import Paging from "../paging/Paging";
import StoryCard from "./StoryCard";
import LoadingScreen from "../loadingScreen/LoadingScreen";

const Story = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(9);
  const [total, setTotal] = useState(0);
  const [storyList, setStoryList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    LoadStories(currentPage, perPage);
  }, [currentPage]);

  const LoadStories = (page, count) => {
    setLoading(true);
    categoryAPI
      .getStories(page, count)
      .then((response) => {
        console.log(response);
        setStoryList(response.data.stories);
        setTotal(response.data.total);
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

  return (
    <div className={styles.block}>
      {loading && <LoadingScreen showGif={true}/>}
      {storyList.map((s) => (
        <StoryCard story={s} />
      ))}
      <Paging
        mode="user"
        totalCount={total}
        currentPage={currentPage}
        pageSize={perPage}
        paging={pagingHandler}
      />
    </div>
  );
};

export default Story;
