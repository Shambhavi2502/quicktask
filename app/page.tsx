"use client";

import Navbar from "../components/Navbar";
import { useTheme } from "./context/ThemeContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

export default function HomePage() {
  const { darkMode } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-500 ${
        darkMode ? "text-white" : "text-gray-900"
      }`}
    >
      {/* Gradient Background */}
      <div
        className={`absolute inset-0 -z-20 animate-gradient bg-gradient-to-r ${
          darkMode
            ? "from-indigo-900 via-black to-purple-900"
            : "from-gray-100 via-white to-gray-200"
        }`}
      />

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <main className="flex flex-col items-center text-center px-6 mt-20 relative z-10">
        <h2 className="text-5xl font-extrabold mb-6 tracking-tight leading-tight">
          Organize Smarter with{" "}
          <span
            className={`bg-clip-text text-transparent animate-gradient-text ${
              darkMode
                ? "bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"
                : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            }`}
          >
            Quick Task
          </span>
        </h2>

        <p
          className={`mb-8 text-lg max-w-xl ${
            darkMode ? "text-gray-300" : "text-gray-800"
          }`}
        >
          Manage your tasks effortlessly, stay productive, and never miss a
          deadline. 🚀
        </p>

        {/* Buttons */}
        <div className="flex space-x-4 justify-center">
          <Link href="/AppComponents/signup">
            <Button
              className="rounded-xl shadow-lg hover:scale-105 transition 
                 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 
                 bg-[length:200%_200%] animate-gradient-text text-white border-0"
            >
              Get Started
            </Button>
          </Link>

          <Link href="/AppComponents/signin">
            <Button
              variant="outline"
              className="rounded-xl shadow hover:scale-105 transition"
            >
              Sign In
            </Button>
          </Link>
          
        </div>
        
      </main>
 {/* Footer */}
      <Footer />
      {/* Animations */}
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
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 12s ease infinite;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
