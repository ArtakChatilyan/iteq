import styles from './Content.module.css'

const Content = () => {
  return (
    <div>
      <div className={styles.adminTitle}><strong>ITEQ</strong> Admin Panel</div>
      <div className={styles.adminText}>Select paragraph to start editing</div>
    </div>
  );
};

export default Content;
