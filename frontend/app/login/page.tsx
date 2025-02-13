"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import api, { AUTH_TOKEN_NAME } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { setCookie } from "../actions/cookies";

export default function Page() {
  return (
    <div className="flex items-center justify-center my-auto mx-auto h-[calc(100vh-3.8rem)] relative">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}

// Zod validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(32, "Password must be at most 32 characters"),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isAuthenticated, signin } = useAuth();

  // Login API function
  async function handleLogin(data: { email: string; password: string }) {
    try {
      const res = await api.post("/v1/auth/login", data);
      setCookie(AUTH_TOKEN_NAME, res.data.api_key);
      const res_data = {
        id: res.data.id,
        created_at: res.data.created_at,
        updated_at: res.data.updated_at,
        name: res.data.name,
      };
      signin(res_data);
      return res.data;
    } catch (error: any) {
      throw error.response?.data?.message || "Login failed";
    }
  }

  const onSubmit = async (data: any) => {
    try {
      await handleLogin(data);
      setError(null);
      toast("Login Successful!");
      router.push("/feeds");
    } catch (err: any) {
      setError(err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      toast("You are already logged in!");
      router.push("/feeds");
    }
  }, [isAuthenticated]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-none md:border-solid">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                />
                {errors.email?.message && (
                  <p className="text-red-500 text-sm">
                    {String(errors.email.message)}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                />
                {errors.password?.message && (
                  <p className="text-red-500 text-sm">
                    {String(errors.password.message)}
                  </p>
                )}
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="underline underline-offset-4"
                prefetch={false}
              >
                Sign up
              </Link>
            </div>
            <div className="w-full my-4 text-xs text-secondary-foreground text-center flex justify-between items-center">
              <Separator className="w-[calc(50%-1rem)]" />
              <span>OR</span>
              <Separator className="w-[calc(50%-1rem)]" />
            </div>
            <Button variant="outline" className="w-full">
              Login with Guest Account
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
