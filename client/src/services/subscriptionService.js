import api from "./api";

export const subscriptionService = {
  getPublicPlans: () => api.get("/subscriptions/plans"),
  getPlanDetails: (id) => api.get(`/subscriptions/plans/${id}`),
  previewPurchase: (planId) => api.post("/subscriptions/preview", { planId }),
  purchasePlan: (payload) => api.post("/subscriptions/purchase", payload),
  getMySubscription: () => api.get("/subscriptions/my-subscription"),
  getSubscriptionHistory: () => api.get("/subscriptions/history"),
  getInvoiceDetails: (id) => api.get(`/subscriptions/invoice/${id}`),
};

export default subscriptionService;
