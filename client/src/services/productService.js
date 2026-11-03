import api from "./api";

export const productService = {
  getAllProducts: (params) => api.get("/products", params),
  getProductById: (id) => api.get(`/products/${id}`),
  getMyProducts: (params) => api.get("/products/my-products", params),
  createProduct: (data) => api.post("/products", data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  uploadProductImages: (files) => {
    const fd = new FormData();
    [...files].forEach((f) => fd.append("images", f));
    return api.post("/products/upload", fd);
  },
  uploadVariantImages: (files) => {
    const fd = new FormData();
    [...files].forEach((f) => fd.append("variantImages", f));
    return api.post("/products/upload/variant", fd);
  },
};

export default productService;
