import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = () => {
  // 1. if is checking login -> spinner/ wating
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-lg font-semibold text-gray-600">
          Loading Lafins...
        </div>
      </div>
    );
  }

  // 2. if after login -> no user -> login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }
};
