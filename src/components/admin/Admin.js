import { Link, Navigate, NavLink, Outlet } from "react-router-dom";
import styles from "./Admin.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth, logout, setLoading } from "../../redux-store/userSlice";
import SplashScreen from "./content/splashscreen/SplashScreen";

const AdminContainer = () => {
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.userReducer.userRole);
  const loading = useSelector((state) => state.userReducer.loading);

  useEffect(() => {
    if (localStorage.getItem("tokenIteq")) {
      dispatch(checkAuth());
    } else {
      dispatch(setLoading(false));
    }
  }, []);

  const logOutHandle = () => {
    dispatch(logout());
  };

  if (loading) return <SplashScreen />;

  if (userRole === "admin") return <Admin logout={logOutHandle}/>;
  else return <Navigate to="/login" replace />;
};

const Admin = ({ logout }) => {
  return (
    <div className={styles.block}>
      <Link onClick={logout} className={styles.logOut}>
        log out
      </Link>
      <ul className={styles.list}>
        <li>
          <NavLink
            to="/admin/categories"
            className={({ isActive, isPending }) => {
              return isActive ? styles.active : "";
            }}
          >
            Categories
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/products"
            className={({ isActive, isPending }) => {
              return isActive ? styles.active : "";
            }}
          >
            Products
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/brands"
            className={({ isActive }) => {
              return isActive ? styles.active : "";
            }}
          >
            Brands
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) => {
              return isActive ? styles.active : "";
            }}
          >
            Orders
          </NavLink>
        </li>
        {/* <li>
          <NavLink
            to="/admin/sliders"
            className={({ isActive }) => {
              return isActive ? styles.active : "";
            }}
          >
            Slider
          </NavLink>
        </li> */}
        {/* <li>
          <NavLink
            to="/admin/partners"
            className={({ isActive }) => {
              return isActive ? styles.active : "";
            }}
          >
            Partners
          </NavLink>
        </li> */}
        {/* <li>
          <NavLink
            to="/admin/portfolio"                 
            className={({ isActive }) => {
              return isActive ? styles.active : "";
            }}
          >
            Portfolio
          </NavLink>
        </li> */}
        <li>
          <NavLink
            to="/admin/aboutus"
            className={({ isActive }) => {
              return isActive ? styles.active : "";
            }}
          >
            AboutUs
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/news"
            className={({ isActive }) => {
              return isActive ? styles.active : "";
            }}
          >
            News
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/clients"
            className={({ isActive }) => {
              return isActive ? styles.active : "";
            }}
          >
            Clients
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/settings"
            className={({ isActive }) => {
              return isActive ? styles.active : "";
            }}
          >
            Settings
          </NavLink>
        </li>
      </ul>

      <Outlet />
    </div>
  );
};

export default AdminContainer;
