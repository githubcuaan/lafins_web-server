import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InputError from "@/components/input-error";
import AuthLayout from "@/layouts/auth-layout";
import { LoaderCircle } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoading, error, user } = useAuth();

  // 1. Khởi tạo state cho form
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  // 2. Nếu user đã đăng nhập thì đá về Dashboard
  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  // 3. Xử lý submit form
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(data);
    } catch (err) {
      // Lỗi đã được xử lý và lưu vào state 'error' trong Context
    }
  };

  return (
    <AuthLayout
      title="Create an account"
      description="Enter your details below to create your account"
    >
      {/* Hiển thị thông báo lỗi chung (nếu có) */}
      {error?.message && (
        <div className="mb-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {error.message}
        </div>
      )}

      <form onSubmit={submit} className="flex flex-col gap-6">
        <div className="grid gap-6">
          {/* --- Name Field --- */}
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              name="name"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              required
              autoFocus
              tabIndex={1}
              autoComplete="name"
              placeholder="Full name"
            />
            <InputError message={error?.errors?.name?.[0]} />
          </div>

          {/* --- Email Field --- */}
          <div className="grid gap-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              required
              tabIndex={2}
              autoComplete="email"
              placeholder="email@example.com"
            />
            <InputError message={error?.errors?.email?.[0]} />
          </div>

          {/* --- Password Field --- */}
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              required
              tabIndex={3}
              autoComplete="new-password"
              placeholder="Password"
            />
            <InputError message={error?.errors?.password?.[0]} />
          </div>

          {/* --- Confirm Password Field --- */}
          <div className="grid gap-2">
            <Label htmlFor="password_confirmation">Confirm password</Label>
            <Input
              id="password_confirmation"
              type="password"
              name="password_confirmation"
              value={data.password_confirmation}
              onChange={(e) =>
                setData({ ...data, password_confirmation: e.target.value })
              }
              required
              tabIndex={4}
              autoComplete="new-password"
              placeholder="Confirm password"
            />
            <InputError message={error?.errors?.password_confirmation?.[0]} />
          </div>

          {/* --- Submit Button --- */}
          <Button
            type="submit"
            className="mt-2 w-full"
            tabIndex={5}
            disabled={isLoading}
          >
            {isLoading && (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create account
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login"
            className="underline hover:text-primary"
            tabIndex={6}
          >
            Log in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
