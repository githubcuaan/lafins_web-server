import { ProtectedRoute } from "@/components/ProtectedRoute";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import Dashboard from "@/pages/dashboard";
import { createBrowserRouter, Navigate } from "react-router-dom";

export const router = createBrowserRouter([
  // public routes
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },

  // protected routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/incomes",
        element: <div>Trang Incomes (Đang refactor...)</div>, // Placeholder
      },
      {
        path: "/outcomes",
        element: <div>Trang Outcomes (Đang refactor...)</div>, // Placeholder
      },
      {
        path: "/jars",
        element: <div>Trang Jars (Đang refactor...)</div>, // Placeholder
      },
      {
        path: "/profile",
        element: <div>Trang Profile (Đang refactor...)</div>, // Placeholder
      },
    ],
  },

  // 404 not found
  {
    path: "*",
    element: <div className="p-10 text-center">404 - Trang không tồn tại</div>,
  },
]);
