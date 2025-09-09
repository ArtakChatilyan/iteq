import { Link, useNavigate } from "react-router-dom";
import CategoryCard from "./categoryCard/CategoryCard";
import styles from "./CategoryMenu.module.css";
import { useDispatch } from "react-redux";
import { setCategory } from "../../redux-store/filterSlice";

const CategoryMenu = ({ categories }) => {
  const dispatch=useDispatch();
  const navigate=useNavigate();

  const SelectCategory = (catId) => {
    dispatch(setCategory({ selectedCategory: catId }));
    return navigate("/category");
  };

  return (
    <div className={styles.block}>
      <div className={styles.content}>
        {categories.map((c) => (
          <Link to={`/category/${c.id}`}>
            <CategoryCard key={c.id} category={c} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryMenu;
