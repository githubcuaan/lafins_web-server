import api from "./api";
import type {
  ApiResponse,
  LoginCredentials,
  RegisterData,
  ResetPasswordData,
  UpdatePasswordData,
  UpdateProfileData,
  User,
} from "@/types";

export const authService = {
  // 1. CSRF Handshake
  getCsrfCookie: async () => {
    await api.get("/sanctum/csrf-cookie", {
      baseURL: import.meta.env.VITE_API_URL?.replace("/api", "") || "/",
    });
  },

  // 2. Login
  login: async (credentials: LoginCredentials) => {
    await authService.getCsrfCookie(); // allway get cookie first
    const response = await api.post("/login", credentials);
    return response.data;
  },

  // 3. Register
  register: async (data: RegisterData) => {
    await authService.getCsrfCookie();
    const response = await api.post("/register", data);
    return response.data;
  },

  // 4. Logout
  logout: async () => {
    await api.post("logout");
  },

  // 5. Get current user
  getCurrentUser: async () => {
    const response = await api.get<ApiResponse<{ user: User }>>("/user");
    return response.data.data.user;
  },

  // 6. Forgot Password
  forgotPassword: async (email: string) => {
    const response = await api.post("/forgot-password", { email });
    return response.data;
  },

  // 7. Reset password
  resetPassword: async (data: ResetPasswordData) => {
    const response = await api.post("/reset-password", data);
    return response.data;
  },

  // 8. Update password
  updatePassword: async (data: UpdatePasswordData) => {
    const response = await api.put("/settings/password", data);
    return response.data;
  },

  // ----- 2FA ------

  // 1. get2FAStatus
  get2FAStatus: async () => {
    const response = await api.get("/settings/2fa");
    return response.data;
  },

  // 2. enable
  enable2FA: async () => {
    const response = await api.post("/settings/2fa/enable");
    return response.data;
  },

  // 3. confirm2FA
  confirm2FA: async (data: { code: string }) => {
    const response = await api.post("/settings/2fa/confirm", data);
    return response.data;
  },

  // 4. disable 2FA
  disable2FA: async () => {
    const response = await api.delete("/settings/2fa/disable");
    return response.data;
  },

  // ----- Profile -----

  // 1. Get profile
  getProfile: async () => {
    const response = await api.get("/profile");
    return response.data;
  },

  // 2. updateProfile
  updateProfile: async (data: UpdateProfileData) => {
    const response = await api.patch("/profile", data);
    return response.data;
  },
};
