import api from "./api";

export const subscriptionService = {
  getPublicPlans: () => api.get("/subscriptions/plans"),
  getPlanDetails: (id) => api.get(`/subscriptions/plans/${id}`),
  previewPurchase: (planId) => api.post("/subscriptions/preview", { planId }),
  purchasePlan: (payload) => api.post("/subscriptions/purchase", payload),
  getMySubscription: () => api.get("/subscriptions/my-subscription"),
  getSubscriptionHistory: () => api.get("/subscriptions/history"),
  getInvoiceDetails: (id) => api.get(`/subscriptions/invoice/${id}`),

  // Admin Subscription Management
  getAdminOverview: () => api.get("/subscriptions/admin/overview"),
  createPlan: (data) => api.post("/subscriptions/admin/plans", data),
  updatePlan: (id, data) => api.put(`/subscriptions/admin/plans/${id}`, data),
  deletePlan: (id) => api.delete(`/subscriptions/admin/plans/${id}`),
};

export default subscriptionService;
