import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InputError from "@/components/input-error";
import AuthLayout from "@/layouts/auth-layout";
import { LoaderCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error, user } = useAuth();

  // State quản lý form thay cho Inertia Form
  const [data, setData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  // Nếu đã login thì đá về dashboard
  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email: data.email, password: data.password });
    } catch (err) {
      // Lỗi đã được xử lý trong AuthContext
    }
  };

  return (
    <AuthLayout
      title="Log in to your account"
      description="Enter your email and password below to log in"
    >
      {/* Hiển thị lỗi chung nếu có (ví dụ: Sai tài khoản/mật khẩu) */}
      {error?.message && (
        <div className="mb-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {error.message}
        </div>
      )}

      <form onSubmit={submit} className="flex flex-col gap-6">
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              required
              autoFocus
              tabIndex={1}
              autoComplete="email"
              placeholder="email@example.com"
            />
            {/* Map lỗi từ Laravel (errors.email) */}
            <InputError message={error?.errors?.email?.[0]} />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              {/* Thay TextLink bằng Link của Router */}
              <Link
                to="/forgot-password"
                className="ml-auto text-sm hover:underline"
                tabIndex={5}
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              name="password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              required
              tabIndex={2}
              autoComplete="current-password"
              placeholder="Password"
            />
            <InputError message={error?.errors?.password?.[0]} />
          </div>

          <div className="flex items-center space-x-3">
            <Checkbox
              id="remember"
              name="remember"
              checked={data.remember}
              onCheckedChange={(checked) =>
                setData({ ...data, remember: checked as boolean })
              }
              tabIndex={3}
            />
            <Label htmlFor="remember">Remember me</Label>
          </div>

          <Button
            type="submit"
            className="mt-4 w-full"
            tabIndex={4}
            disabled={isLoading} // Disable khi đang gọi API
            data-test="login-button"
          >
            {isLoading && (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            )}
            Log in
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="underline hover:text-primary"
            tabIndex={5}
          >
            Sign up
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
