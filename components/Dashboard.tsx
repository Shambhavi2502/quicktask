//don,t need this file

"use client";


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/AppComponents/signin"); // 🚫 not logged in
        return;
      }

      if (mounted) setUser(session.user);
      setLoading(false);
    };

    load();

    // keep route protected if they log out in another tab
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) router.replace("/AppComponents/signin");
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/AppComponents/signin");
  };

  if (loading) return <p className="p-6">Checking authentication…</p>;

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p>You’re signed in as <span className="font-medium">{user?.email}</span></p>

      <Button onClick={handleLogout} className="w-fit">Log out</Button>
    </main>
  );
}
