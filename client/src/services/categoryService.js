import api from "./api";

export const categoryService = {
  getAllCategories: () => api.get("/categories"),
  getCategoryById: (id) => api.get(`/categories/${id}`),
  getSubcategoriesByCategory: (categoryId) => api.get(`/categories/${categoryId}/subcategories`),
  getAllSubcategories: (params) => api.get("/subcategories", params),
  getSubcategoryById: (id) => api.get(`/subcategories/${id}`),
};

export default categoryService;
