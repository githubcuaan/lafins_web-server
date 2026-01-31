import { password } from "@/routes";
import api from "./api";
import type {
  ApiResponse,
  LoginCredentials,
  LoginResponse,
  RegisterData,
  ResetPasswordData,
  twoFactorChallengeResponse,
  TwoFactorSecretKey,
  TwoFactorSetupData,
  UpdatePasswordData,
  UpdateProfileData,
  User,
} from "@/types";

export const authService = {
  // 1. CSRF Handshake
  // getCsrfCookie: async () => { await api.get("/sanctum/csrf-cookie", { baseURL: import.meta.env.VITE_API_URL?.replace("/api", "") || "/", }); },

  // ----- AUTHENTICATION (Login / Register / Logout) -----

  // Login
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<ApiResponse<LoginResponse>>("/login", {
      ...credentials,
      device_name: navigator.userAgent,
    });

    // if backend serve token -> no 2fa
    if (response.data.data.token) {
      localStorage.setItem("auth_token", response.data.data.token);
    }

    // if dont -> enabled 2fa
    return response.data;
  },

  // twoFactorChallenge
  twoFactorChallenge: async (code: string, tempToken: string) => {
    const response = await api.post<ApiResponse<twoFactorChallengeResponse>>(
      "/two-factor-challenge",
      { code, device_name: navigator.userAgent },
      {
        headers: {
          Authorization: `Bearer ${tempToken}`,
        },
      },
    );

    const token = response.data.data.token;

    if (token) {
      localStorage.setItem("auth_token", token);
    }

    return response.data;
  },

  //  Register
  register: async (data: RegisterData) => {
    const response = await api.post("/register", {
      ...data,
      device_name: navigator.userAgent,
    });

    if (response.data.data.token) {
      localStorage.setItem("auth_token", response.data.data.token);
    }

    return response.data;
  },

  // 4. Logout
  logout: async () => {
    try {
      await api.post("logout");
    } finally {
      localStorage.removeItem("auth_token");
    }
  },

  // 5. Get current user
  getCurrentUser: async () => {
    const response = await api.get<ApiResponse<{ user: User }>>("/user");
    return response.data.data.user;
  },

  // ----- PASSWORD MANAGEMENT -----

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
    const response = await api.delete("/settings/2fa/disable", {
      data: { password },
    });
    return response.data;
  },

  showQrCode: async (): Promise<TwoFactorSetupData> => {
    const response = await api.get("/settings/2fa/qr-code");
    return response.data;
  },

  showSecretKey: async (): Promise<TwoFactorSecretKey> => {
    const response = await api.get("/settings/2fa/secret-key");
    return response.data;
  },

  getRecoveryCodes: async (data: { password: string }) => {
    const response = await api.post("/settings/2fa/recovery-codes/show", data);
    return response.data;
  },

  regenerateRecoveryCodes: async (data: { password: string }) => {
    const response = await api.post("/settings/2fa/recovery-codes", data);
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
