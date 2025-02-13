"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api, { AUTH_TOKEN_NAME } from "@/lib/axios"; // Import Axios instance
import { cn } from "@/lib/utils";
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
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getCookie, setCookie } from "../actions/cookies";
import { useAuth } from "@/providers/auth";

export default function Page() {
  return (
    <div className="flex items-center justify-center my-auto mx-auto h-[calc(100vh-3.8rem)]">
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
  );
}

const signupSchema = z.object({
  name: z.string(),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(32, "Password must be at most 32 characters"),
});

function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { signin, isAuthenticated } = useAuth();

  function handleSignup(data: { email: string; password: string }) {
    return api
      .post("/v1/auth/signup", data)
      .then((res) => {
        setCookie(AUTH_TOKEN_NAME, res.data.api_key);
        const res_data = {
          id: res.data.id,
          created_at: res.data.created_at,
          updated_at: res.data.updated_at,
          name: res.data.name,
        };
        signin(res_data);
        return res.data;
      })
      .catch((error) => {
        throw error.response?.data?.error || "Signup failed";
      });
  }

  const onSubmit = async (data: any) => {
    try {
      await handleSignup(data);
      setError(null);
      toast("Account Created Successfully!");
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
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Name</Label>
                <Input
                  id="name"
                  type="name"
                  placeholder="Name"
                  {...register("name")}
                />
                {errors.name?.message && (
                  <p className="text-red-500 text-sm">
                    {String(errors.name.message)}
                  </p>
                )}
              </div>
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
                  placeholder="Password"
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
                Sign Up
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="underline underline-offset-4"
                prefetch={false}
              >
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
