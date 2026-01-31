import { ProtectedRoute } from "@/components/ProtectedRoute";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import Dashboard from "@/pages/dashboard";
import Incomes from "@/pages/incomes";
import Outcomes from "@/pages/outcomes";
import Jarsconfig from "@/pages/jarconfigs";
import Welcome from "@/pages/welcome";
import ProfileSettings from "@/pages/settings/profile";
import PasswordSettings from "@/pages/settings/password";
import TwoFactorSettings from "@/pages/settings/two-factor";
import AppearanceSettings from "@/pages/settings/appearance";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  // public routes
  {
    path: "/",
    element: <Welcome />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },

  // protected routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/incomes",
        element: <Incomes />,
      },
      {
        path: "/outcomes",
        element: <Outcomes />,
      },
      {
        path: "/jars",
        element: <Jarsconfig />,
      },
      {
        path: "/settings/profile",
        element: <ProfileSettings />,
      },
      {
        path: "/settings/password",
        element: <PasswordSettings />,
      },
      {
        path: "/settings/2fa",
        element: <TwoFactorSettings />,
      },
      {
        path: "/settings/appearance",
        element: <AppearanceSettings />,
      },
    ],
  },

  // 404 not found
  {
    path: "*",
    element: <div className="p-10 text-center">404 - Trang không tồn tại</div>,
  },
]);
