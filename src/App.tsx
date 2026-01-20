import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/routes";

// 1. tao client cho React Query (cache, retry, ...)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false, // not retry when switch tab
      staleTime: 1000 * 60 * 5, // cache data in 5 minute
    },
  },
});

function App() {
  return (
    // Layer 1: data fetching
    <QueryClientProvider client={queryClient}>
      {/*Layer 2: Authentication*/}
      <AuthProvider>
        {/*Layer 3: Routing*/}
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
