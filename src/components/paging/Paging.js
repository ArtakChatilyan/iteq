import styles from "./Paging.module.css";

const Paging = (props) => {
  function onPaging(pageNumber) {
    props.paging(pageNumber);
  }

  let pageCount = Math.ceil(props.totalCount / props.pageSize);
  let pagination = [];

  if (props.currentPage === 1)
    pagination.push(
      <button key="p1" className={`${styles.pagerItem} ${props.mode==='user' ? styles.pagerItemUser : ''}`} disabled>
        &lt;
      </button>
    );
  else
    pagination.push(
      <button key="p2"
        className={`${styles.pagerItem} ${props.mode==='user' ? styles.pagerItemUser : ''}`}
        onClick={() => {
          onPaging(1);
        }}
      >
        &lt;
      </button>
    );
  if (props.currentPage > 2)
    pagination.push(<span  key="p3" className={styles.ellipses}>...</span>);
  if (props.currentPage > 1)
    pagination.push(
      <button key="p4"
        className={`${styles.pagerItem} ${props.mode==='user' ? styles.pagerItemUser : ''}`}
        onClick={() => {
          onPaging(props.currentPage - 1);
        }}
      >
        {props.currentPage - 1}
      </button>
    );
  pagination.push(
    <button key="p5" disabled  className={`${styles.pagerItem} ${styles.selected} ${props.mode==='user' ? styles.selectedUser : ''}`}>
      {props.currentPage}
    </button>
  );
  if (props.currentPage < pageCount)
    pagination.push(
      <button key="p6"
        className={`${styles.pagerItem} ${props.mode==='user' ? styles.pagerItemUser : ''}`}
        onClick={() => {
          onPaging(props.currentPage + 1);
        }}
      >
        {props.currentPage + 1}
      </button>
    );
  if (props.currentPage < pageCount - 1)
    pagination.push(<span key="p7" className={styles.ellipses}>...</span>);

  if (props.currentPage === pageCount)
    pagination.push(
      <button key="p8" className={`${styles.pagerItem} ${props.mode==='user' ? styles.pagerItemUser : ''}`} disabled>
        &gt;
      </button>
    );
  else
    pagination.push(
      <button key="p9"
        className={`${styles.pagerItem} ${props.mode==='user' ? styles.pagerItemUser : ''}`}
        onClick={() => {
          onPaging(pageCount);
        }}
      >
        &gt;
      </button>
    );

  return <div>{pagination}</div>;
};

export default Paging;
