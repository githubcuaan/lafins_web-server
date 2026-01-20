import axios from "axios";

const api = axios.create({
  // Use proxy in dev, explicit URL in production
  baseURL: import.meta.env.VITE_API_URL || "/api",

  // Quan trọng: Gửi kèm Cookie/Session
  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor để tự động thêm CSRF token vào header
api.interceptors.request.use((config) => {
  // Lấy CSRF token từ cookie
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="))
    ?.split("=")[1];

  if (token) {
    config.headers["X-XSRF-TOKEN"] = decodeURIComponent(token);
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
    }

    return Promise.reject(error);
  },
);

export default api;
