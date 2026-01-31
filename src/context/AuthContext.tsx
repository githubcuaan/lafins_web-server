import { authService } from "@/services/auth";
import type {
  AuthError,
  LoginCredentials,
  LoginResponse,
  RegisterData,
  User,
} from "@/types";
import { type ReactNode, createContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<LoginResponse>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: AuthError | null;
  checkAuth: () => Promise<void>;
  appName: string;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<AuthError | null>(null);

  // ---- check stuff ------
  // check if u r loging or not
  const checkAuth = async () => {
    try {
      const UserData = await authService.getCurrentUser();
      setUser(UserData);
    } catch (err) {
      setUser(null);
      console.log("checkauth err: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  // check it imidiately when the Provider is mount.
  useEffect(() => {
    checkAuth();
  }, []);

  // ------ login stuff --------
  // login logic
  const login = async (credentials: LoginCredentials) => {
    setError(null);
    try {
      const loginRes = await authService.login(credentials);
      if (loginRes.data.token) {
        await checkAuth();
      }

      return loginRes;
    } catch (err) {
      const axiosError = err as { response?: { data?: AuthError } };
      setError({
        message: axiosError.response?.data?.message || "Login failed",
        errors: axiosError.response?.data?.errors,
      });
      throw err;
    }
  };

  // register logic
  const register = async (data: RegisterData) => {
    setError(null);

    try {
      await authService.register(data);
      await checkAuth();
    } catch (err) {
      const axiosError = err as { response?: { data?: AuthError } };
      setError({
        message: axiosError.response?.data?.message || "Register failed",
        errors: axiosError.response?.data?.errors,
      });
      throw err;
    }
  };

  // logout
  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      console.error(
        "Server logout failed, clearing local session anyway:",
        err,
      );
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isLoading,
        error,
        checkAuth,
        appName: "Lafins",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
