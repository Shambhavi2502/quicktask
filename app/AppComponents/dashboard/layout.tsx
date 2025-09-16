"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Home, Folder, PlusCircle, User, LogOut } from "lucide-react";
import Navbar from "@/components/Navbar"; // ✅ reuse the same Navbar
import { useTheme } from "../../context/ThemeContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { darkMode } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

 const handleLogout = async () => {
  await supabase.auth.signOut();
  router.replace("/");  // ✅ Redirect to home page
};

  const links = [
    { href: "/AppComponents/dashboard", label: "Overview", icon: <Home className="h-5 w-5" /> },
    { href: "/AppComponents/dashboard/profile", label: "Profile", icon: <User className="h-5 w-5" /> },
  ];

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      {/* 🔹 Navbar reused */}
      <Navbar />

<div className="flex flex-1 mt-16">   {/* 👈 Added mt-16 to offset navbar */}
        {/* Sidebar */}
        <aside className={`w-64 p-6 shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h2 className="text-xl font-bold mb-8">Dashboard</h2>
          
          <nav className="space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition ${
                  pathname === link.href
                    ? darkMode
                      ? "bg-gray-700"
                      : "bg-gray-200"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-2 w-full rounded-lg hover:bg-red-500/20 text-red-500 mt-6 transition"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>

      {/* 🔹 Animations for gradient text */}
      <style jsx global>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient-text {
          background-size: 200% 200%;
          animation: gradient 6s ease infinite;
        }
      `}</style>
    </div>
  );
}
