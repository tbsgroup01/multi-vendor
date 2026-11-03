import api from "./api";

export const vendorService = {
  getAllVendors: (params) => api.get("/vendors", params),
  getVendorById: (id) => api.get(`/vendors/${id}`),
  approveVendor: (id) => api.put(`/vendors/${id}/approve`),
  rejectVendor: (id, reason = "") => api.put(`/vendors/${id}/reject`, { reason }),
  updateVendorStatus: (id, status) => api.put(`/vendors/${id}/status`, { status }),
};

export default vendorService;
