"use client";

import Link from "next/link";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer
      className="w-full border-t border-gray-300 dark:border-gray-700 
                 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 
                 fixed bottom-0 left-0 z-50"
    >
      <div className="max-w-6xl mx-auto px-5 py-4 
                      flex flex-col md:flex-row items-center 
                      justify-between text-sm font-medium">
        
        {/* Left: Links */}
        <div className="flex space-x-6 order-1 md:order-1">
          <Link
            href="/AppComponents/privacy"
            className="hover:text-blue-500 transition"
          >
            Privacy Policy
          </Link>
          <Link
            href="/AppComponents/terms"
            className="hover:text-blue-500 transition"
          >
            Terms of Service
          </Link>
          <Link
            href="/AppComponents/contact"
            className="hover:text-blue-500 transition"
          >
            Contact
          </Link>
        </div>

        {/* Center: Copyright */}
       <div className="order-3 md:order-2 mt-3 md:mt-0 md:ml-[-60px] text-center">
          © {new Date().getFullYear()}{" "}
          <span className="font-extrabold">Quick Task</span>. All rights reserved.
        </div>


        {/* Right: Social */}
        <div className="flex space-x-5 order-2 md:order-3 mt-3 md:mt-0">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition"
            aria-label="GitHub"
          >
            <FaGithub size={20} />
          </a>
          <a
            href="https://linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition"
            aria-label="LinkedIn"
          >
            <FaLinkedin size={20} />
          </a>
          <a
            href="https://twitter.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition"
            aria-label="Twitter"
          >
            <FaTwitter size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
