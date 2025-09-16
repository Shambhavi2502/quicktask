"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        console.log("✅ User signed in:", session.user)
        router.push("/AppComponents/dashboard")
      } else {
        router.push("/AppComponents/signin")
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Signing you in...</p>
    </div>
  )
}
