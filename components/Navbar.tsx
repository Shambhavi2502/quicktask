"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  Moon,
  Sun,
  LogIn,
  UserPlus,
  Home,
  LogOut,
  LayoutDashboard,
  User,
} from "lucide-react";
import { FaRegCalendarCheck } from "react-icons/fa";
import { useTheme } from "../app/context/ThemeContext";
import { supabase } from "@/lib/supabaseClient"; // ✅ Supabase client



export default function Navbar() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  // 🔹 Utility to apply active link styles
  const linkClasses = (href: string) =>
    `flex items-center space-x-2 p-2 rounded-lg transition ${
      pathname === href
        ? darkMode
          ? "bg-gray-700 text-cyan-400 font-semibold"
          : "bg-gray-200 text-blue-600 font-semibold"
        : "hover:bg-gray-200 dark:hover:bg-gray-700"
    }`;

  return (
    <nav
      className={`absolute top-0 left-0 w-full flex items-center justify-between px-6 py-4 shadow-md z-20 ${
        darkMode ? "bg-gray-900/90" : "bg-white/90"
      }`}
    >
      {/* Logo + App Name */}
      <Link href="/" className="flex items-center space-x-2">
        <FaRegCalendarCheck
          className={`h-7 w-7 ${
            darkMode ? "text-cyan-400" : "text-blue-600"
          }`}
        />
        <h1
          className={`text-2xl font-extrabold tracking-wide bg-clip-text text-transparent animate-gradient-text ${
            darkMode
              ? "bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"
              : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
          }`}
        >
          Quick Task
        </h1>
      </Link>

      {/* Menu Toggle */}
      <button
        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Dropdown */}
      {menuOpen && (
        <div
          className={`absolute top-16 right-6 w-56 rounded-2xl shadow-xl p-4 flex flex-col space-y-2 animate-fade-in z-30 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          {/* Always show Home */}
          {pathname !== "/" && (
            <Link
              href="/"
              className={linkClasses("/")}
              onClick={() => setMenuOpen(false)}
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
          )}

          {!session ? (
            <>
              {pathname !== "/AppComponents/signin" && (
                <Link
                  href="/AppComponents/signin"
                  className={linkClasses("/AppComponents/signin")}
                  onClick={() => setMenuOpen(false)}
                >
                  <LogIn className="h-5 w-5" />
                  <span>Sign In</span>
                </Link>
              )}

              {pathname !== "/AppComponents/signup" && (
                <Link
                  href="/AppComponents/signup"
                  className={linkClasses("/AppComponents/signup")}
                  onClick={() => setMenuOpen(false)}
                >
                  <UserPlus className="h-5 w-5" />
                  <span>Sign Up</span>
                </Link>
              )}
            </>
          ) : (
            <>
              <Link
                href="/AppComponents/dashboard"
                className={linkClasses("/AppComponents/dashboard")}
                onClick={() => setMenuOpen(false)}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>

              <Link
                href="/AppComponents/dashboard/profile"
                className={linkClasses("/AppComponents/dashboard/profile")}
                onClick={() => setMenuOpen(false)}
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-red-500/20 text-red-500 transition"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={() => {
              toggleDarkMode();
              setMenuOpen(false);
            }}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {darkMode ? (
              <>
                <Sun className="h-5 w-5 text-yellow-400" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="h-5 w-5 text-blue-600" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>
      )}
    </nav>
  );
}
