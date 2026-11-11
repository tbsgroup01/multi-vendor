import api from "./api";

export const adminService = {
  getDashboardStats: () => api.get("/admin/dashboard-stats"),
  createPlan: (data) => api.post("/admin/plans", data),
  getAllPlans: (params) => api.get("/admin/plans", params),
  getPlanById: (id) => api.get(`/admin/plans/${id}`),
  updatePlan: (id, data) => api.put(`/admin/plans/${id}`, data),
  deletePlan: (id) => api.delete(`/admin/plans/${id}`),
  getAllVendorSubscriptions: (params) => api.get("/admin/subscriptions", params),
  assignPlanToVendor: (data) => api.post("/admin/assign-plan", data),
  createCategory: (data) => api.post("/admin/categories", data),
  getAllCategories: () => api.get("/admin/categories"),
  getCategoryById: (id) => api.get(`/admin/categories/${id}`),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
  createSubcategory: (data) => api.post("/admin/subcategories", data),
  getAllSubcategories: (params) => api.get("/admin/subcategories", params),
  getSubcategoryById: (id) => api.get(`/admin/subcategories/${id}`),
  updateSubcategory: (id, data) => api.put(`/admin/subcategories/${id}`, data),
  deleteSubcategory: (id) => api.delete(`/admin/subcategories/${id}`),
  getAllCustomers: (params) => api.get("/admin/customers", params),
  getCustomerById: (id) => api.get(`/admin/customers/${id}`),
  deleteCustomer: (id) => api.delete(`/admin/customers/${id}`),
  getAllPayments: (params) => api.get("/admin/payments", params),
  deletePayment: (id) => api.delete(`/admin/payments/${id}`),
  getAdminProfile: () => api.get("/admin/profile"),
  updateAdminProfile: (data) => api.put("/admin/profile", data),
  dropDatabase: () => api.post("/admin/dropexist"),
};

export default adminService;
