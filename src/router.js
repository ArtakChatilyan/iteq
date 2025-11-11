import { createBrowserRouter, Navigate } from "react-router-dom";

import Home from "./components/home/home";
import NotFound from "./components/notfound/NotFound";
import SubCategories from "./components/admin/content/subcategories/SubCategories";
import MainCategories from "./components/admin/content/maincategories/MainCategories";
import AddCategory from "./components/admin/content/maincategories/AddCategory";
import EditCategory from "./components/admin/content/maincategories/EditCategory";
import AddSubCategory from "./components/admin/content/subcategories/AddSubCategory";
import EditSubCategory from "./components/admin/content/subcategories/EditSubCategory";
import Brands from "./components/admin/content/brands/Brands";
import AddBrand from "./components/admin/content/brands/AddBrand";
import EditBrand from "./components/admin/content/brands/EditBrand";
import Products from "./components/admin/content/products/Products";
import AddProduct from "./components/admin/content/products/AddProduct";
import EditProduct from "./components/admin/content/products/EditProduct";
import ProductImages from "./components/admin/content/products/ProductImages";
import ProductCategories from "./components/admin/content/products/ProductCategories";
import Content from "./components/admin/content/Content";

import Main from "./components/main/Main";
import CategoryContainer from "./components/category/CategoryContainer";
import ProductDetail from "./components/productMenu/productDetails/ProductDetail";
import News from "./components/admin/content/news/News";
import AddNews from "./components/admin/content/news/AddNews";
import EditNews from "./components/admin/content/news/EditNews";
import AboutUs from "./components/about/About";
import Contacts from "./components/contacts/Contacts";
import AboutUsAdmin from "./components/admin/content/aboutus/AboutUs";

import LoginContainer from "./components/login/LoginContainer";
import RegisterContainer from "./components/registration/RegisterContainer";
import AccountContainer from "./components/account/AccountContainer";
import AdminContainer from "./components/admin/Admin";
import Discounts from "./components/discounts/Discounts";
import Story from "./components/story/Story";
import StoryDetail from "./components/story/StoryDetail";
import Search from "./components/search/Search";
import Clients from "./components/admin/content/clients/Clients";
import NotFoundAdmin from "./components/notfound/NotFoundAdmin";
import Settings from "./components/admin/content/settings/Settings";
import Colors from "./components/admin/content/colors/Colors";
import AddColor from "./components/admin/content/colors/AddColor";
import EditColor from "./components/admin/content/colors/EditColor";
import Models from "./components/admin/content/products/models/Models";
import ProductDescriptions from "./components/admin/content/products/descriptions/ProductDescriptions";
import Orders from "./components/admin/content/clients/Orders";
import History from "./components/admin/content/clients/History";
import PasswordRecovery from "./components/passwordRecovery/PasswordRecovery";
import UserOrders from "./components/account/orders/UserOrders";
import Basket from "./components/account/basket/Basket";
import Purchases from "./components/account/purchases/Purchases";
import Password from "./components/account/password/Password";
import Questions from "./components/admin/content/questions/Questions";
import AddQuestion from "./components/admin/content/questions/AddQuestion";
import EditQuestion from "./components/admin/content/questions/EditQuestion";
import Faqs from "./components/faqs/Faqs";
import BrandProducts from "./components/brandProducts/BrandProducts";
import Analytics from "./components/admin/content/analytics/Analytics";
import Cookies from "universal-cookie";

const supportedLangs = ["en", "ru", "ka"];
const cookies = new Cookies("langIteq", { path: "/" });
const cookieLang = cookies.get("langIteq");
const defaultLang = supportedLangs.includes(cookieLang) ? cookieLang : "ka";
const router = createBrowserRouter([
  // --- Redirect root "/" to default language ---
  {
    path: "/",
    element: <Navigate to={`/${defaultLang}`} replace />,
  },

  // --- Multilanguage user routes ---
  {
    path: "/:lang",
    element: <Home />,
    children: [
      { index: true, element: <Main /> },
      { path: "about", element: <AboutUs /> },
      { path: "discounts", element: <Discounts /> },
      { path: "brands/:brandId", element: <BrandProducts /> },
      { path: "contacts", element: <Contacts /> },
      {
        path: "category/:categoryId?/:brands?/:minPrice?/:maxPrice?/:page?",
        element: <CategoryContainer />,
      },
      { path: "product/:productId", element: <ProductDetail /> },
      { path: "news", element: <Story /> },
      { path: "news/:newsId", element: <StoryDetail /> },
      { path: "faqs", element: <Faqs /> },
      { path: "search/:searchItem", element: <Search /> },
      { path: "login", element: <LoginContainer /> },
      { path: "register", element: <RegisterContainer /> },
      {
        path: "account",
        element: <AccountContainer />,
        children: [
          { index: true, element: <div>welcome</div> },
          { path: "basket/:userId", element: <Basket /> },
          { path: "orders/:userId", element: <UserOrders /> },
          { path: "orderHistory/:userId", element: <Purchases /> },
          { path: "settings/:userId", element: <Password /> },
        ],
      },
      { path: "passwordRecovery/:userId?", element: <PasswordRecovery /> },
      { path: "*", element: <NotFound /> },
    ],
  },

  // --- Admin panel (not language-dependent) ---
  {
    path: "/admin",
    element: <AdminContainer />,
    children: [
      { index: true, element: <Content /> },
      { path: "categories", element: <MainCategories /> },
      { path: "addCategory", element: <AddCategory /> },
      { path: "editCategory/:categoryId", element: <EditCategory /> },
      { path: "subCategories/:parentId", element: <SubCategories /> },
      { path: "addSubCategory/:parentId", element: <AddSubCategory /> },
      { path: "editSubCategory/:itemId", element: <EditSubCategory /> },
      { path: "brands/:page?", element: <Brands /> },
      { path: "addBrand/:page", element: <AddBrand /> },
      { path: "editBrand/:itemId/:page", element: <EditBrand /> },
      { path: "products/:page?/:sType?/:sTerm?/:sCat?", element: <Products /> },
      {
        path: "addProduct/:page/:sType/:sTerm?/:sCat?",
        element: <AddProduct />,
      },
      {
        path: "editProduct/:itemId/:page/:sType/:sTerm?/:sCat?",
        element: <EditProduct />,
      },
      {
        path: "productCategories/:itemId/:page/:sType/:sTerm?",
        element: <ProductCategories />,
      },
      { path: "models/:productId/:page/:sType/:sTerm?", element: <Models /> },
      {
        path: "productImages/:itemId/:page/:sType/:sTerm?",
        element: <ProductImages />,
      },
      {
        path: "productDescriptions/:itemId/:page/:sType/:sTerm?",
        element: <ProductDescriptions />,
      },
      { path: "colors", element: <Colors /> },
      { path: "addColor", element: <AddColor /> },
      { path: "editColor/:itemId", element: <EditColor /> },
      { path: "aboutus", element: <AboutUsAdmin /> },
      { path: "news/:page?", element: <News /> },
      { path: "addNews/:page", element: <AddNews /> },
      { path: "editNews/:itemId/:page", element: <EditNews /> },
      { path: "clients", element: <Clients /> },
      { path: "orders/:clientId?", element: <Orders /> },
      { path: "history/:clientId?", element: <History /> },
      { path: "questions/:page?", element: <Questions /> },
      { path: "editQuestion/:itemId/:page", element: <EditQuestion /> },
      { path: "addQuestion/:page", element: <AddQuestion /> },
      { path: "settings", element: <Settings /> },
      {path: "analytics", element: <Analytics />},
      { path: "*", element: <NotFoundAdmin /> },
    ],
  },

  // --- Catch invalid language codes ---
  // {
  //   path: "*",
  //   element: <Navigate to="/en" replace />,
  // },
]);

export default router;
//export { supportedLangs };
