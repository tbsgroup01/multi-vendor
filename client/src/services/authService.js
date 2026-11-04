import api from "./api";

export const authService = {
  registerCustomer: async (data) => {
    const res = await api.post("/auth/register", { ...data, role: "user" });
    if (res?.token) localStorage.setItem("token", res.token);
    if (res?.user) localStorage.setItem("user", JSON.stringify(res.user));
    return res;
  },
  registerVendor: async (data) => {
    const res = await api.post("/auth/register/vendor", { ...data, role: "vendor" });
    if (res?.token) localStorage.setItem("token", res.token);
    if (res?.user) localStorage.setItem("user", JSON.stringify(res.user));
    return res;
  },
  registerAdmin: (data) => api.post("/auth/register", { ...data, role: "admin" }),
  login: async (credentials) => {
    const data = await api.post("/auth/login", credentials);
    if (data?.token) localStorage.setItem("token", data.token);
    if (data?.user) localStorage.setItem("user", JSON.stringify(data.user));
    return data;
  },
  sendCustomerLoginOtp: (payload) => api.post("/auth/send-login-otp", payload),
  verifyCustomerLoginOtp: async (payload) => {
    const data = await api.post("/auth/verify-login-otp", payload);
    if (data?.token) localStorage.setItem("token", data.token);
    if (data?.user) localStorage.setItem("user", JSON.stringify(data.user));
    return data;
  },
  getCurrentUser: () => api.get("/auth/me"),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  verifyOtp: (payload) => api.post("/auth/verify-otp", payload),
  resetPassword: (payload) => api.post("/auth/reset-password", payload),
  resendOtp: (email) => api.post("/auth/resend-otp", { email }),
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

export default authService;
