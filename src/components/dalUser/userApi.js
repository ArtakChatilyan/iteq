import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/api/v1/",
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("tokenIteq")}`;
  return config;
});

instance.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status == 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/users/refresh",
          {
            withCredentials: true,
          }
        );
        localStorage.setItem("tokenIteq", response.data.accessToken);
        return instance.request(originalRequest);
      } catch (e) {
        console.log("Unauthorized request detected!");
      }
    }
    throw error;
  }
);

export const usersAPI = {
  login: (data) => {
    return instance.post("users/login", data);
  },
  registration: (data) => {
    return instance.post("users/registration", data);
  },
  logout: () => {
    return instance.post("users/logout");
  },
  checkAuth: () => {
    return instance.get("users/refresh");
  },
  getUsers: () => {
    return instance.get("users");
  },
  sendEmail: (data) => {
    return instance.post("users/email", data);
  },
};

export const categoryAPI = {
  getMainCategories: () => {
    return instance.get("user/categories/main");
  },
  getBrands: () => {
    return instance.get("brands/all");
  },
  getCategories: () => {
    return instance.get(`user/categories`);
  },
  getCategoriesById: (categoryId) => {
    return instance.get(`user/categories/?categoryId=${categoryId}`);
  },
  getProducts: (catId, page, count, brandList, minPrice, maxPrice) => {
    return instance.get(
      `user/products/?page=${page}&perPage=${count}&catId=${catId}&brands=${brandList}&minPrice=${minPrice}&maxPrice=${maxPrice}`
    );
  },
  getProductCategories: (pId) => {
    return instance.get(`user/products/productCategories/${pId}`);
  },
  getProduct: (pId) => {
    return instance.get(`user/products/${pId}`);
  },
  getDiscounts: (page, count) => {
    return instance.get(`user/discounts/?page=${page}&perPage=${count}`);
  },
  getDiscountsAll: () => {
    return instance.get(`user/discounts/all`);
  },
  getBrands: () => {
    return instance.get(`user/brands`);
  },
  getStories: (page, count) => {
    return instance.get(`user/stories/?page=${page}&perPage=${count}`);
  },
  getStory: (storyId) => {
    return instance.get(`user/stories/${storyId}`);
  },
  searchByBrand: (term) => {
    return instance.get(`user/search/brand?term=${term}`);
  },
  getProductsByBrand: (term, page, perPage) => {
    return instance.get(
      `user/search/productsByBrand?term=${term}&page=${page}&perPage=${perPage}`
    );
  },
  searchByModel: (term) => {
    return instance.get(`user/search/model?term=${term}`);
  },
  getProductsByModel: (term, page, perPage) => {
    return instance.get(
      `user/search/productsByModel?term=${term}&page=${page}&perPage=${perPage}`
    );
  },
  searchByCategory: (term) => {
    return instance.get(`user/search/category?term=${term}`);
  },
  getProductsByCategory: (term, page, perPage) => {
    return instance.get(
      `user/search/productsByCategory?term=${term}&page=${page}&perPage=${perPage}`
    );
  },
};

export const portfolioAPI = {
  getPortfolio: (page, count) => {
    return instance.get(`user/portfolio/?page=${page}&perPage=${count}`);
  },
  getPortfolioById: (id) => {
    return instance.get("user.portfolio/:id");
  },
};

export const partnersAPI = {
  getPartners: (page, count) => {
    return instance.get(`user/partners/?page=${page}&perPage=${count}`);
  },
};
