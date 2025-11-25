import axios from "axios";

const instance = axios.create({
  baseURL:process.env.REACT_APP_BASE_API_URL, 
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
          process.env.REACT_APP_BASE_API_URL+"users/refresh", 
          {
            withCredentials: true,
          }
        );
        localStorage.setItem("tokenIteq", response.data.accessToken);
        return instance.request(originalRequest);
      } catch (e) {
        console.log(e);
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
  resend: () => {
    return instance.get("users/resend");
  },
  changePassword: (data) => {
    return instance.post("users/changePassword", data);
  },
  logout: () => {
    return instance.post("users/logout");
  },
  checkAuth: () => {
    return instance.get("users/refresh");
  },
  recover: (data) => {
    return instance.post("users/recover", data);
  },
  setPassword: (userId, password) => {
    return instance.post("users/setPassword", { userId, password });
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
    return instance.get(
      `/category/:categoryId?/:brands?/:minPrice?/:maxPrice?/:page?=${categoryId}`
    );
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

  getBrandProducts: (brandId, page, count) => {
    return instance.get(
      `user/brandProducts/?brandId=${brandId}&page=${page}&perPage=${count}`
    );
  },

  getBrandById: (brandId) => {
    return instance.get(`user/brands/byId/?brandId=${brandId}`);
  },

  getBrands: () => {
    return instance.get(`user/brands`);
  },
  getBrandsForCategory: (catId) => {
    return instance.get(`user/brands/byCategory/?catId=${catId}`);
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
  searchProducts: (term) => {
    return instance.get(`user/search/general?term=${term}`);
  },
  searchProductsByGeneral: (term, page, perPage) => {
    return instance.get(
      `user/search/generalProducts?term=${term}&page=${page}&perPage=${perPage}`
    );
  },
};

export const imageAPI = {
  getImagesDefault: (id) => {
    return instance.get(`user/products/imagesDefault/${id}`);
  },
  getImagesByColor: (id) => {
    return instance.get(`user/products/imagesByColor/${id}`);
  },
  getImagesBySize: (id) => {
    return instance.get(`user/products/imagesBySize/${id}`);
  },
  getImagesMix: (id) => {
    return instance.get(`user/products/imagesMix/${id}`);
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

export const settingsAPI = {
  getAbout: () => {
    return instance.get("settings/about");
  },
  getContacts: () => {
    return instance.get("settings/contacts");
  },
};

export const basketAPI = {
  getUserBasket: (page, count, userId) => {
    return instance.get(
      `user/basket?page=${page}&perPage=${count}&userId=${userId}`
    );
  },
  getBasket: (id) => {
    return instance.get(`user/basket/${id}`);
  },
  getUserTotal: (id) => {
    return instance.get(`user/basket/total/${id}`);
  },

  updateBasketCount: (basketId, count) => {
    return instance.put("user/basket", { basketId, count });
  },

  addBasket: (data) => {
    return instance.post(`user/basket`, data);
  },
  deleteBasket: (id) => {
    return instance.delete(`user/basket/${id}`);
  },
};

export const orderAPI = {
  getUserOrders: (page, count, userId) => {
    return instance.get(
      `user/orders?page=${page}&perPage=${count}&userId=${userId}`
    );
  },
  addOrder: (data) => {
    return instance.post("user/orders", data);
  },
  updateOrder: (id, actionType) => {
    return instance.put(`user/orders/${id}/${actionType}`);
  },
};

export const historyAPI = {
  getUserHistory: (page, count, userId) => {
    return instance.get(
      `user/history?page=${page}&perPage=${count}&userId=${userId}`
    );
  },
};

export const faqsAPI = {
  getFaqs: (page, count) => {
    return instance.get(`user/questions?page=${page}&perPage=${count}`);
  },
};

export const visitsAPI = {
  addVisit: (data) => {
    return instance.post("visits", data);
  },
};

export const chatAPI={
  getUserMessages:(userId)=>{
    return instance.get(`chat/messages/${userId}`);
  },
}
