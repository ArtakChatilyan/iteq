import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_API_URL,
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});

export const categoryAPI = {
  getMainCategories: () => {
    return instance.get("categories/main");
  },
  getCategories: (page, count) => {
    return instance.get(`categories?page=${page}&perPage=${count}`);
  },
  getCategory: (id) => {
    return instance.get(`categories/${id}`);
  },

  addCategory: (data) => {
    return instance.post(`categories`, data);
  },

  editCategory: (data, id) => {
    return instance.put(`categories/${id}`, data);
  },

  getCategoriesForProduct: () => {
    return instance.get("categories/all");
  },

  deleteCategory: (id) => {
    return instance.delete(`categories/${id}`);
  },
  getCategoryBrands: (id) => {
    return instance.get(`categories/categoryBrands/${id}`);
  },

  setCategoryBrands: (id, result) => {
    return instance.post(`categories/categoryBrands`, { id, result });
  },
};

export const subcategoryAPI = {
  getSubCategories: (parentId, page, count) => {
    return instance.get(
      `subcategories?parentId=${parentId}&page=${page}&perPage=${count}`
    );
  },

  getSubCategory: (id) => {
    return instance.get(`subcategories/${id}`);
  },

  addSubCategory: (parentId, parentType, data) => {
    return instance.post("subcategories", {
      parentId: parentId,
      parentType: parentType,
      data: data,
    });
  },

  editSubCategory: (data, id) => {
    return instance.put(`subcategories/${id}`, data);
  },

  deleteSubCategory: (id) => {
    return instance.delete(`subcategories/${id}`);
  },

  getParents: (id) => {
    return instance.get(`subcategories/parents/${id}`);
  },
};

export const colorAPI = {
  getColors: () => {
    return instance.get("colors");
  },

  getProductColors: (id) => {
    return instance.get(`colors/productColors/${id}`);
  },

  getModelColors: (id) => {
    return instance.get(`models/modelColors/${id}`);
  },

  setModelColors: (id, result) => {
    return instance.post(`models/modelColors`, { id, result });
  },

  getColor: (id) => {
    return instance.get(`colors/${id}`);
  },

  addColor: (data) => {
    return instance.post("colors", data);
  },

  editColor: (data, id) => {
    return instance.put(`colors/${id}`, data);
  },

  deleteColor: (id) => {
    return instance.delete(`colors/${id}`);
  },
};

export const brandsAPI = {
  getBrandsAll: () => {
    return instance.get("brands/all");
  },

  getBrands: (page, count) => {
    return instance.get(`brands?page=${page}&perPage=${count}`);
  },

  getBrand: (id) => {
    return instance.get(`brands/${id}`);
  },

  addBrand: (data) => {
    return instance.post(`brands`, data);
  },

  editBrand: (data, id) => {
    return instance.put(`brands/${id}`, data);
  },

  deleteBrand: (id) => {
    return instance.delete(`brands/${id}`);
  },
};

export const productsAPI = {
  getProducts: (page, count) => {
    return instance.get(`products?page=${page}&perPage=${count}`);
  },

  getProduct: (id) => {
    return instance.get(`products/${id}`);
  },

  addProduct: (data) => {
    return instance.post(`products`, data);
  },

  editProduct: (data, id) => {
    return instance.put(`products/${id}`, data);
  },

  deleteProduct: (id) => {
    return instance.delete(`products/${id}`);
  },

  getProductCategories: (id) => {
    return instance.get(`products/productCategories/${id}`);
  },

  setProductCategories: (id, result) => {
    return instance.post(`products/productCategories`, { id, result });
  },

  getProductImages: (id) => {
    return instance.get(`products/productImages/${id}`);
  },

  getProductMedias: (id) => {
    return instance.get(`products/productMedias/${id}`);
  },

  addProductImage: (data) => {
    return instance.post(`products/productImages`, data);
  },

  addProductMedia: (data) => {
    return instance.post(`products/productMedias`, data);
  },

  deleteImage: (id) => {
    return instance.delete(`products/productImage/${id}`);
  },

  deleteMedia: (id) => {
    return instance.delete(`products/productMedia/${id}`);
  },

  getDescriptions: (productId) => {
    return instance.get(`products/descriptions/${productId}`);
  },
  getDescription: (descriptionId) => {
    return instance.get(`products/description/${descriptionId}`);
  },
  addDescription: (data) => {
    return instance.post(`products/descriptions`, data);
  },
  updateDescription: (descriptionId, data) => {
    return instance.put(`products/descriptions/${descriptionId}`, data);
  },
  deleteDescription: (descriptionId) => {
    return instance.delete(`products/descriptions/${descriptionId}`);
  },
};

export const modelAPI = {
  getModels: (productId) => {
    return instance.get(`models?productId=${productId}`);
  },

  getModel: (id) => {
    return instance.get(`models/${id}`);
  },

  addModel: (productId, data) => {
    return instance.post("models", {
      productId: productId,
      modelData: data,
    });
  },

  editModel: (id, data) => {
    return instance.put(`models/${id}`, data);
  },

  deleteModel: (id) => {
    return instance.delete(`models/${id}`);
  },
  getSizes: (id) => {
    return instance.get(`models/modelsizes/${id}`);
  },

  getSize: (id) => {
    return instance.get(`models/modelsize/${id}`);
  },

  deleteSize: (id) => {
    return instance.delete(`models/modelsize/${id}`);
  },

  addSize: (data) => {
    return instance.post(`models/modelsizes`, data);
  },

  editSize: (id, data) => {
    return instance.put(`models/modelsize/${id}`, data);
  },

  getImageColorSize: (modelId, imageId) => {
    return instance.get(`models/modelImageColorSize/${modelId}/${imageId}`);
  },

  setImageColorSize: (data) => {
    return instance.post(`models/modelImageColorSize`, data);
  },

  deleteImageColorSize: (id) => {
    return instance.delete(`models/modelImageColorSize/${id}`);
  },

  getMediaColorSize: (modelId, mediaId) => {
    return instance.get(`models/modelMediaColorSize/${modelId}/${mediaId}`);
  },

  setMediaColorSize: (data) => {
    return instance.post(`models/modelMediaColorSize`, data);
  },

  deleteMediaColorSize: (id) => {
    return instance.delete(`models/modelMediaColorSize/${id}`);
  },

  getDescriptionColorSize: (modelId, descriptionId) => {
    return instance.get(
      `models/modelDescriptionColorSize/${modelId}/${descriptionId}`
    );
  },

  setDescriptionColorSize: (data) => {
    return instance.post(`models/modelDescriptionColorSize`, data);
  },

  deleteDescriptionColorSize: (id) => {
    return instance.delete(`models/modelDescriptionColorSize/${id}`);
  },
};

export const slidesAPI = {
  getSlides: () => {
    return instance.get("slides");
  },
  addSlide: (data) => {
    return instance.post("slides", data);
  },
  deleteSlide: (id) => {
    return instance.delete(`slides/${id}`);
  },
};

export const partnerAPI = {
  getPartners: (page, count) => {
    return instance.get(`partners?page=${page}&perPage=${count}`);
  },
  addPartner: (data) => {
    return instance.post(`partners`, data);
  },
  getPartner: (id) => {
    return instance.get(`partners/${id}`);
  },
  editPartner: (data, id) => {
    return instance.put(`partners/${id}`, data);
  },
  deletePartner: (id) => {
    return instance.delete(`partners/${id}`);
  },
};

export const newsAPI = {
  getNews: (page, count) => {
    return instance.get(`news?page=${page}&perPage=${count}`);
  },
  addNews: (data) => {
    return instance.post(`news`, data);
  },
  getNewsById: (id) => {
    return instance.get(`news/${id}`);
  },
  editNews: (data, id) => {
    return instance.put(`news/${id}`, data);
  },
  deleteNews: (id) => {
    return instance.delete(`news/${id}`);
  },
};

export const portfolioAPI = {
  getPortfolioAll: (page, count) => {
    return instance.get(`portfolio?page=${page}&perPage=${count}`);
  },
  getPortfolio: (id) => {
    return instance.get(`portfolio/${id}`);
  },
  addPortfolio: (data) => {
    return instance.post("portfolio", data);
  },
  editPortfolio: (id, data) => {
    return instance.put(`portfolio/${id}`, data);
  },
  deletePortfolio: (id) => {
    return instance.delete(`portfolio/${id}`);
  },
  getPortfolioImages: (id) => {
    return instance.get(`portfolio/portfolioImages/${id}`);
  },
  addPortfolioImage: (data) => {
    return instance.post("portfolio/portfolioImages", data);
  },
  deleteImage: (id) => {
    return instance.delete(`portfolio/portfolioImages/${id}`);
  },
  getPortfolioOptions: (id) => {
    return instance.get(`portfolio/portfolioOptions/${id}`);
  },
  getPortfolioOption: (id) => {
    return instance.get(`portfolio/portfolioOption/${id}`);
  },
  editPortfolioOption: (id, data) => {
    return instance.put(`portfolio/portfolioOption/${id}`, data);
  },
  addPortfolioOptions: (id, data) => {
    console.log(id);

    return instance.post("portfolio/portfolioOptions", { id, data });
  },
  deletePortfolioOptions: (id) => {
    return instance.delete(`portfolio/portfolioOptions/${id}`);
  },
};

export const searchAPI = {
  searchByBrand: (term) => {
    return instance.get(`user/search/brand?term=${term}`);
  },
  getProductsByBrand: (term, page, perPage, selectedCategory) => {
    return instance.get(
      `user/search/productsByBrand?term=${term}&page=${page}&perPage=${perPage}&category=${selectedCategory}`
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
};

export const clientAPI = {
  getClients: (page, count) => {
    return instance.get(`users?page=${page}&perPage=${count}`);
  },
};

export const settingsAPI = {
  getAbout: () => {
    return instance.get("settings/about");
  },
  getContacts: () => {
    return instance.get("settings/contacts");
  },
  updateAbout: (data) => {
    return instance.put("settings/about", data);
  },
  updateContact: (data) => {
    return instance.put("settings/contacts", data);
  },
  setContactsMedia: (data) => {
    return instance.put("settings/media", data);
  },
};

export const orderApi = {
  getOrders: (page, count) => {
    return instance.get(`orders?page=${page}&perPage=${count}`);
  },
  getOrdersByClient: (page, count, clientId) => {
    return instance.get(
      `orders/byClient?userId=${clientId}&page=${page}&perPage=${count}`
    );
  },

  approveOrder: (orderId) => {
    return instance.put(`orders/byClient`, { orderId });
  },

  closeOrder: (closeId, orderId) => {
    return instance.post("orders/close", { closeId, orderId });
  },
  cancelOrder: (cancelId, orderId) => {
    return instance.post("orders/cancel", { cancelId, orderId });
  },

  getHistory: (page, count) => {
    return instance.get(`orders/history?page=${page}&perPage=${count}`);
  },
  getHistoryByClient: (page, count, clientId) => {
    return instance.get(
      `orders/history/byClient?userId=${clientId}&page=${page}&perPage=${count}`
    );
  },

  getOrdersCount: () => {
    return instance.get("orders/count");
  },
};

export const questionsApi = {
  getQuestions: (page, count) => {
    return instance.get(`questions?page=${page}&perPage=${count}`);
  },
  addQuestion: (data) => {
    return instance.post(`questions`, data);
  },
  getQuestionById: (id) => {
    return instance.get(`questions/${id}`);
  },
  editQuestion: (data, id) => {
    return instance.put(`questions/${id}`, data);
  },
  deleteQuestion: (id) => {
    return instance.delete(`questions/${id}`);
  },
};

export const visitsAPI = {
  getSummary: () => {
    return instance.get("visits/summary");
  },
  getPages: (start, end) => {
    return instance.get(`visits/pages?start=${start}&end=${end}`);
  },
  getCountries: (start, end) => {
    return instance.get(`visits/countries?start=${start}&end=${end}`);
  },
  getTimeSeries: (start, end) => {
    return instance.get(`visits/timeseries?start=${start}&end=${end}`);
  },
};

export const chatAPI={
  getUsers:()=>{
    return instance.get("chat/users");
  },
  getUserMessages:(userId)=>{
    return instance.get(`chat/messages/${userId}`);
  },
  getUnreadList:()=>{
    return instance.get("chat/unread");
  },
  markAsSeen:(userId)=>{
    return instance.put(`chat/seen/${userId}`);
  }
}
