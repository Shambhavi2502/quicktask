"use client";

import { useTheme } from "@/app/context/ThemeContext";
import Navbar from "@/components/Navbar";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { darkMode } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-500 ${
        darkMode ? "text-white" : "text-gray-900"
      }`}
    >
      {/* Background Gradient */}
      <div
        className={`absolute inset-0 -z-20 animate-gradient bg-gradient-to-r ${
          darkMode
            ? "from-indigo-900 via-black to-purple-900"
            : "from-gray-100 via-white to-gray-200"
        }`}
      />

      {/* Shared Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="w-full flex justify-center items-center mt-24 z-10">
        {children}
      </main>

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
        .animate-gradient-text {
          background-size: 200% 200%;
          animation: gradient 8s ease infinite;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
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
