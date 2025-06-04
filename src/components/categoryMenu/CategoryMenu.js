import { Link } from "react-router-dom";
import CategoryCard from "./categoryCard/CategoryCard";
import styles from "./CategoryMenu.module.css";

const CategoryMenu = ({ categories }) => {
 
  return (
    <div className={styles.block}>
      <div className={styles.content}>
        {categories.map((c) => (<Link to={`/category/${c.id}`}>
          <CategoryCard key={c.id} category={c} />
        </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryMenu;
