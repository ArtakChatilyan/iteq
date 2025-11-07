import { Link, useNavigate, useParams } from "react-router-dom";
import CategoryCard from "./categoryCard/CategoryCard";
import styles from "./CategoryMenu.module.css";
import { useDispatch } from "react-redux";
import { setCategory } from "../../redux-store/filterSlice";
import { Helmet } from "react-helmet-async";

const CategoryMenu = ({ categories }) => {
  const { lang } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const SelectCategory = (catId) => {
    dispatch(setCategory({ selectedCategory: catId }));
    return navigate("/category");
  };

  return (
    

      <div className={styles.block}>
        <div className={styles.content}>
          {categories.map((c) => (
            <Link
              key={`lc${c.id}`}
              to={`/${lang}/category/${c.id}/${0}/${-1}/${-1}/${1}`}
            >
              <CategoryCard key={c.id} category={c} />
            </Link>
          ))}
        </div>
      </div>
    
  );
};

export default CategoryMenu;
