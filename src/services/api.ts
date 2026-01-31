import axios from "axios";

const api = axios.create({
  // Use proxy in dev, explicit URL in production
  baseURL: import.meta.env.VITE_API_URL || "/api",

  // token-based
  withCredentials: false,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor để tự động thêm CSRF token vào header
api.interceptors.request.use((config) => {
  // get token from localStorage
  const token = localStorage.getItem("auth_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    // Nếu lỗi 401 (Hết hạn session / Chưa login) -> Đá về login
    if (response && response.status === 401) {
      // Xóa thông tin user ở client nếu cần
      // window.location.href = '/login';
      localStorage.removeItem("auth_token");
    }

    return Promise.reject(error);
  },
);

export default api;
