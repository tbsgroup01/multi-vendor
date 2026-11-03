import api from "./api";

export const cartService = {
  getCart: () => api.get("/cart"),
  addToCart: ({ productId, variantId = null, quantity = 1 }) =>
    api.post("/cart/add", { productId, variantId, quantity }),
  updateCartItem: (id, quantity) => api.put(`/cart/update/${id}`, { quantity }),
  removeFromCart: (id) => api.delete(`/cart/remove/${id}`),
  clearCart: () => api.delete("/cart/clear"),
  getCheckoutPreview: () => api.get("/cart/checkout-preview"),
  checkout: (payload) => api.post("/cart/checkout", payload),
};

export default cartService;
