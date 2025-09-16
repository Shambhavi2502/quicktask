"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import Link from "next/link"
import AuthLayout from "@/components/Layout/AuthLayout"
import Footer from "@/components/Footer"   // ✅ import Footer



export default function SignIn() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ✅ Listen for OAuth session after redirect
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (session?.user) {
        router.push("/AppComponents/dashboard")
      }
    })
    return () => subscription.unsubscribe()
  }, [router])

  // --- Email/Password Login ---
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      router.push("/AppComponents/dashboard")
    }
  }

  // --- OAuth Login ---
  const handleOAuthLogin = async (provider: "google" | "github") => {
    setError(null)
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <AuthLayout>
        
      <form
        onSubmit={handleSignIn}
        className="w-full max-w-3xl sm:max-w-lg -mt-3 mb-15 z-10"
      >

           <Card className="w-full p-4 bg-white dark:bg-neutral-900 shadow-md rounded-xl border border-gray-200 dark:border-neutral-800">
         <CardHeader className="flex flex-col items-center space-y-1">
    <CardTitle className="text-center text-3xl font-extrabold animate-gradient-text bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      Welcome Back
    </CardTitle>
    <CardDescription className="text-center text-gray-500 dark:text-gray-400">
      Enter your email and password to continue.
    </CardDescription>
  </CardHeader>

          {/* ---- Form ---- */}
          <CardContent className="space-y-4">
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-3">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm">
                  Remember me
                </Label>
              </div>
              <Button variant="link" className="px-2 text-sm">
                Forgot password
              </Button>
            </div>
          </CardContent>

          {/* ---- Footer ---- */}
          <CardFooter className="flex flex-col gap-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 text-white rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-[length:200%_200%] animate-gradient-text shadow-lg hover:scale-105 transition"
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>

            <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
              Or login with
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
              Don’t have an account?
              <Link href="/AppComponents/signup">
                <Button variant="link" className="px-1">
                  Register
                </Button>
              </Link>
            </div>
          </CardFooter>
        </Card>
      </form>

        {/* ✅ Reusable Footer */}
        <Footer />
     
    </AuthLayout>
  )
}
