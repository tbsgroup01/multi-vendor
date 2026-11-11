import api from "./api";

export const vendorService = {
  getMyDashboard: () => api.get("/vendors/me/dashboard"),
  getMySettings: () => api.get("/vendors/me/settings"),
  updateMySettings: (settings) => api.put("/vendors/me/settings", settings),
  getMyNotifications: () => api.get("/vendors/me/notifications"),
  getAllVendors: (params) => api.get("/vendors", params),
  getVendorById: (id) => api.get(`/vendors/${id}`),
  approveVendor: (id) => api.put(`/vendors/${id}/approve`),
  rejectVendor: (id, reason = "") => api.put(`/vendors/${id}/reject`, { reason }),
  updateVendorStatus: (id, status) => api.put(`/vendors/${id}/status`, { status }),
  deleteVendor: (id) => api.delete(`/vendors/${id}`),
};

export default vendorService;
