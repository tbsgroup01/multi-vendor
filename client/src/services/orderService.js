import api from "./api";

export const orderService = {
  getMyOrders: (params) => api.get("/orders/my-orders", params),
  getOrderById: (id) => api.get(`/orders/${id}`),
  getVendorOrders: (params) => api.get("/orders/vendor/my-orders", params),
  updateOrderItemStatus: (id, status) => api.put(`/orders/items/${id}/status`, { status }),
};

export default orderService;
