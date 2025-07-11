import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter } from "react-router-dom";

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
import Category from "./components/category/Category";
import ProductDetail from "./components/productMenu/productDetails/ProductDetail";
import News from "./components/admin/content/news/News";
import AddNews from "./components/admin/content/news/AddNews";
import EditNews from "./components/admin/content/news/EditNews";
import AboutUs from "./components/about/About";
import Contacts from "./components/contacts/Contacts";
import AboutUsAdmin from "./components/admin/content/aboutus/AboutUs";

import store from "./redux-store/store";
import { Provider } from "react-redux";
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

const root = ReactDOM.createRoot(document.getElementById("root"));

const router = createBrowserRouter([
  {
    // errorElement: <NotFound />,
    path: "/",
    element: <Home />,
    children: [
      {
        path: "",
        element: <Main />,
      },
      {
        path: "/about",
        element: <AboutUs />,
      },
      {
        path: "/discounts",
        element: <Discounts />,
      },
      {
        path: "/contacts",
        element: <Contacts />,
      },
      {
        path: "/category/:categoryId",
        element: <Category />,
      },
      {
        path: "/product/:productId",
        element: <ProductDetail />,
      },
      {
        path: "/news",
        element: <Story />,
      },
      {
        path: "/news/:newsId",
        element: <StoryDetail />,
      },
      {
        path: "/search/:searchItem/:searchType",
        element: <Search />,
      },
      {
        path: "/login",
        element: <LoginContainer />,
      },
      {
        path: "/register",
        element: <RegisterContainer />,
      },
      {
        path: "/account",
        element: <AccountContainer />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
      // {
      //   path: "/services",
      //   element: <Services />,
      // },
      // {
      //   path: "/portfolio",
      //   element: <PortfolioPublic />,
      // },
      // {
      //   path: "/portfolio/:portfolioId",
      //   element: <PortfolioItem />,
      // },
      // {
      //   path: "/partners",
      //   element: <PartnersPublic />,
      // },
    ],
  },
  {
    path: "/admin",
    element: <AdminContainer />,
    children: [
      {
        path: "",
        element: <Content />,
      },
      {
        path: "/admin/categories",
        element: <MainCategories />,
      },
      {
        path: "/admin/addCategory",
        element: <AddCategory />,
      },
      {
        path: "/admin/editCategory/:categoryId",
        element: <EditCategory />,
      },
      {
        path: "/admin/subCategories/:parentId/",
        element: <SubCategories />,
      },
      {
        path: "/admin/addSubCategory/:parentId/",
        element: <AddSubCategory />,
      },
      {
        path: "/admin/editSubCategory/:itemId",
        element: <EditSubCategory />,
      },
      {
        path: "/admin/brands/:page?",
        element: <Brands />,
      },
      {
        path: "/admin/addBrand/:page",
        element: <AddBrand />,
      },
      {
        path: "/admin/editBrand/:itemId/:page",
        element: <EditBrand />,
      },
      {
        path: "/admin/products/:page?/:sType?",
        element: <Products />,
      },
      {
        path: "/admin/addProduct/:page/:sType",
        element: <AddProduct />,
      },
      {
        path: "/admin/editProduct/:itemId/:page/:sType",
        element: <EditProduct />,
      },
      {
        path: "/admin/productCategories/:itemId/:page",
        element: <ProductCategories />,
      },
      {
        path: "/admin/models/:productId/:page",
        element: <Models />,
      },
      {
        path: "/admin/productImages/:itemId/:page",
        element: <ProductImages />,
      },
      {
        path: "/admin/productDescriptions/:itemId/:page",
        element: <ProductDescriptions />,
      },
      // {
      //   path: "/admin/productColors/:itemId/:page",
      //   element: <ProductColors />,
      // },
      // {
      //   path: "/admin/productSizes/:itemId/:page",
      //   element: <ProductSizes />,
      // },
      // {
      //   path: "/admin/addProductSize/:id",
      //   element: <AddProductSize />,
      // },
      // {
      //   path: "/admin/editProductSize/:itemId/:id",
      //   element: <EditProductSize />,
      // },
      
      
      
      {
        path: "/admin/colors",
        element: <Colors />,
      },
      {
        path: "/admin/addColor",
        element: <AddColor />,
      },
      {
        path: "/admin/editColor/:itemId",
        element: <EditColor />,
      },
      {
        path: "/admin/aboutus",
        element: <AboutUsAdmin />,
      },
      {
        path: "/admin/news",
        element: <News />,
      },
      {
        path: "/admin/addNews",
        element: <AddNews />,
      },
      {
        path: "/admin/clients",
        element: <Clients />,
      },
      {
        path: "/admin/editNews/:itemId",
        element: <EditNews />,
      },
      {
        path: "/admin/settings",
        element: <Settings />,
      },
      {
        path: "*",
        element: <NotFoundAdmin />,
      },
      // {
      //   path: "/admin/sliders",
      //   element: <Slides />,
      // },
      // {
      //   path: "/admin/partners",
      //   element: <Partners />,
      // },
      // {
      //   path: "/admin/addPartner",
      //   element: <AddPartner />,
      // },
      // {
      //   path: "/admin/editPartner/:itemId",
      //   element: <EditPartner />,
      // },
      // {
      //   path: "/admin/portfolio",
      //   element: <Portfolio />,
      // },
      // {
      //   path: "/admin/addPortfolio",
      //   element: <AddPortfolio />,
      // },
      // {
      //   path: "/admin/editPortfolio/:itemId",
      //   element: <EditPortfolio />,
      // },
      // {
      //   path: "/admin/portfolioImages/:itemId",
      //   element: <PortfolioImages />,
      // },
      // {
      //   path: "/admin/portfolioOptions/:itemId",
      //   element: <PortfolioOptions />,
      // },
      // {
      //   path: "/admin/addPortfolioOption/:itemId",
      //   element: <AddPortfolioOption />,
      // },
      // {
      //   path: "/admin/editPortfolioOptions/:itemId/:optionId",
      //   element: <EditPortfolioOption />,
      // },
    ],
  },
]);
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <App router={router} />
  </Provider>
  //</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
