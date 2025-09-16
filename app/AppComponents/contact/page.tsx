"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      {/* Navbar */}
      <Navbar />

      {/* Contact Section */}
      <section
        id="contact"
        className="flex justify-center items-center flex-1 px-6 py-12 bg-red-100 dark:bg-gray-900 pt-20 pb-15"
      >
        <div className="flex flex-col lg:flex-row w-full max-w-5xl bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Left Side */}
          <div className="w-full lg:w-1/2 p-8 bg-pink-600 text-white flex flex-col justify-center items-center">
            <h2 className="text-3xl font-extrabold mb-6">Let&apos;s Chat</h2>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112333.62510356228!2d79.3395382493704!3d28.376205065769796!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39a007334d02998d%3A0x5b9d44cf31ee87f!2sBareilly%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1720237936659!5m2!1sen!2sin"
              width="100%"
              height="300"
              loading="lazy"
              title="Bareilly Location"
              className="rounded-xl shadow-lg"
              style={{ maxWidth: "350px" }}
            ></iframe>
            <p className="text-base text-center mt-6 px-4 opacity-90">
              Have a question, want to start a project, or just connect? Send me
              a quick message!
            </p>
          </div>

          {/* Right Side (Form) */}
          <div className="w-full lg:w-1/2 p-8 flex justify-center items-center bg-gray-50">
            <form
              action="https://formspree.io/f/mvgpoyvn"
              method="POST"
              className="w-full max-w-md space-y-5"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1 text-gray-700"
                >
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="block w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1 text-gray-700"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="block w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label
                  htmlFor="company"
                  className="block text-sm font-medium mb-1 text-gray-700"
                >
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  className="block w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-1 text-gray-700"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  className="block w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full px-4 py-3 bg-gradient-to-r from-pink-600 to-pink-500 text-white rounded-lg font-semibold hover:opacity-90 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
