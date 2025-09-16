"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTheme } from "@/app/context/ThemeContext";
import { FileText, ShieldCheck, Users, Mail } from "lucide-react";

export default function TermsAndConditions() {
  const { darkMode } = useTheme();

  return (
     <div
      className={`min-h-screen flex flex-col transition-colors duration-500 relative overflow-hidden ${
        darkMode ? "text-gray-200" : "text-gray-900"
      }`}
    >
      {/* Animated Gradient Background */}
      <div
        className={`absolute inset-0 -z-20 animate-gradient ${
          darkMode
            ? "bg-gradient-to-r from-indigo-900 via-black to-purple-900"
            : "bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100"
        }`}
      />
      {/* Navbar */}
      <Navbar />


 {/* Hero Section */}
      <section className="relative w-full py-20 text-center z-10">
        <h1 className="text-5xl md:text-4xl font-extrabold tracking-tight mt-4 mb-5 animate-fade-in">
          Terms & Conditions
        </h1>
        <p
          className={`max-w-2xl mx-auto text-lg ${
            darkMode ? "text-gray-300" : "text-gray-800"
          }`}
        >Please read these Terms & Conditions carefully before using{" "}
            <strong>Quick Task</strong>.  
            By accessing or using our platform, you agree to be bound by them.
         </p>
      </section>


    
      {/* Content */}
     <main className="flex-1 px-6 py-16 max-w-5xl mx-auto space-y-12 relative z-10 -mt-20 ">
         {[
          {
            icon: FileText,
            title: "Acceptance of Terms",
            desc: "By accessing or using Quick Task, you confirm your agreement to these Terms. If you do not agree, please discontinue use of the platform immediately.",
          },
          {
            icon: ShieldCheck,
            title: "Use of Services",
            desc: "You agree to use our services responsibly and in compliance with applicable laws. Any misuse may result in suspension or termination of your account.",
          },
          {
            icon: Users,
            title: "User Responsibilities",
            desc: "You are responsible for maintaining the confidentiality of your account and for all activities carried out under it.",
          },
          {
            icon: Mail,
            title: "Contact Us",
            desc: (
              <>
                If you have any questions about these Terms, feel free to reach
                out at{" "}
                <a
                  href="mailto:support@quicktask.com"
                  className="text-blue-500 hover:underline"
                >
                  support@quicktask.com
                </a>
                .
              </>
            ),
          },
        ].map((section, i) => (
                  <div
                    key={i}
                    className={`relative flex flex-col md:flex-row items-start gap-6 rounded-2xl shadow-lg p-8 border transform transition hover:scale-[1.02] ${
                      darkMode
                        ? "bg-gray-900/70 border-gray-800 hover:shadow-purple-500/20"
                        : "bg-white/80 border-gray-200 hover:shadow-purple-200/60 backdrop-blur"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center ${
                        darkMode
                          ? "bg-gradient-to-r from-purple-600 to-pink-600"
                          : "bg-gradient-to-r from-blue-500 to-purple-500"
                      } text-white`}
                    >
                      <section.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold mb-2">{section.title}</h2>
                      <p className="text-base leading-relaxed">{section.desc}</p>
                    </div>
                  </div>
                ))}
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
                @keyframes fade-in {
                  from {
                    opacity: 0;
                    transform: translateY(10px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
                .animate-fade-in {
                  animation: fade-in 0.6s ease-out forwards;
                }
              `}</style>
            </div>
          );
        }
        