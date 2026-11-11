export const SERVER_URL =
  import.meta.env?.VITE_SERVER_URL ||
  (import.meta.env?.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "")
    : "");

export const BASE_URL =
  import.meta.env?.VITE_API_URL || (SERVER_URL ? `${SERVER_URL}/api` : "/api");

export const getUploadUrl = (path) => {
  if (!path) return "";
  if (typeof path !== "string") return "";
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:") ||
    path.startsWith("blob:")
  ) {
    return path;
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SERVER_URL}${cleanPath}`;
};

export const getAuthToken = () => localStorage.getItem("token");
export const setAuthToken = (token) => {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
};
export const clearAuthToken = () => localStorage.removeItem("token");

const request = async (endpoint, method = "GET", body = null, params = null) => {
  const token = getAuthToken();
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let url = `${BASE_URL}${endpoint}`;
  if (params) {
    const query = new URLSearchParams(params).toString();
    if (query) url += `?${query}`;
  }

  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  if (!isFormData && body) headers["Content-Type"] = "application/json";

  const res = await fetch(url, {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : null,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const error = new Error(data?.message || res.statusText);
    error.details = data?.error;
    throw error;
  }
  return data;
};

const api = {
  get: (url, params) => request(url, "GET", null, params),
  post: (url, body) => request(url, "POST", body),
  put: (url, body) => request(url, "PUT", body),
  delete: (url) => request(url, "DELETE"),
};

export default api;
