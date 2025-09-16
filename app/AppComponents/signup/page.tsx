"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import AuthLayout from "@/components/Layout/AuthLayout";
import Footer from "@/components/Footer"   // ✅ import Footer


export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });

    if (error) {
      if (error.message.includes("already registered")) {
        setError("Account already exists. Please login.");
        setTimeout(() => router.push("/AppComponents/signin"), 2000);
      } else {
        setError(error.message);
      }
    } else {
      if (data.session) {
        router.push("/AppComponents/dashboard");
      } else {
        router.push("/AppComponents/signin");
      }
    }

    setLoading(false);
  };

  const handleOAuthLogin = async (provider: "google" | "github") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) setError(error.message);
  };

  return (
    <AuthLayout>
      <form
        onSubmit={handleRegister}
        className="w-full max-w-3xl sm:max-w-lg -mt-2 mb-7 pb-10"
      >
        <Card className="w-full p-4 bg-white dark:bg-neutral-900 shadow-md rounded-xl border border-gray-200 dark:border-neutral-800">
         <CardHeader className="flex flex-col items-center space-y-1">
    <CardTitle className="text-center text-3xl font-extrabold animate-gradient-text bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      Create Account
    </CardTitle>
    <CardDescription className="text-center text-gray-500 dark:text-gray-400">
      Fill in your details to register
    </CardDescription>
  </CardHeader>

          <CardContent className="space-y-4">
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" required placeholder="Enter your full name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="Enter your email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required placeholder="Enter password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" required placeholder="Confirm password" />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 text-white rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-[length:200%_200%] animate-gradient-text shadow-lg hover:scale-105 transition"
            >
              {loading ? "Registering..." : "Register"}
            </Button>

            <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
              Or sign up with
            </div>
            <div className="flex w-full flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-10 flex items-center justify-center gap-2"
                onClick={() => handleOAuthLogin("google")}
              >
                <FcGoogle size={20} /> Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-10 flex items-center justify-center gap-2"
                onClick={() => handleOAuthLogin("github")}
              >
                <FaGithub size={20} /> GitHub
              </Button>
            </div>

            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              Already have an account?
              <Link href="/AppComponents/signin">
                <Button variant="link" className="px-1">
                  Sign in
                </Button>
              </Link>
            </div>
          </CardFooter>
        </Card>
      </form>
      <Footer />
    </AuthLayout>
  );
}
