"use client";

import Image from "next/image";
import React, { useState } from "react";
import { SiChatbot } from "react-icons/si";
import { FaTimes, FaCommentDots } from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    tgUsername: "",
    subject: "",
    message: "",
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [botCheck, setBotCheck] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          botCheck
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message.");
      }

      setSuccessMessage("Message sent to MrAbhi2k3!");
      setFormData({ name: "", email: "", tgUsername: "", subject: "", message: "" });
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (error: unknown) {
      console.error(error);
      const msg = error instanceof Error ? error.message : "Failed to send message. Try again.";
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(""), 4000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] pointer-events-auto">
        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          aria-label="Open contact chat"
          className="cursor-pointer border-3 sm:border-4 border-foreground bg-brutal-yellow p-3 sm:p-4 text-black shadow-brutal hover:shadow-brutal-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-sm transition-all group block select-none"
        >
          <div className="relative">
            <SiChatbot className="h-6 w-6 sm:h-7 sm:w-7 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brutal-pink opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-brutal-pink border border-black"></span>
            </span>
          </div>
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-[10000] flex items-end justify-end bg-black/70 p-2 sm:p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-sm overflow-hidden border-3 sm:border-4 border-foreground bg-card text-card-foreground shadow-brutal-xl">
            <div className="flex items-center justify-between border-b-3 sm:border-b-4 border-foreground bg-brutal-yellow p-3 text-black">
              <div className="flex items-center gap-2">
                <FaCommentDots className="h-4 w-4" />
                <h2 className="text-xs sm:text-sm font-black uppercase tracking-tight">
                  Contact Me
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="cursor-pointer border-2 border-black bg-white p-1 text-black shadow-brutal-sm hover:bg-black hover:text-white transition"
              >
                <FaTimes className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex items-center space-x-3 border-b-2 border-foreground bg-muted p-3">
              <Image
                src="https://i.ibb.co/0yMtdqqK/sticker-boy-coding-computer-anime-s-creative-design-bold-line-cute-kawaii-st-655090-454640.jpg"
                alt="Chatbot"
                className="h-10 w-10 border-2 border-foreground object-cover shrink-0"
                width={200}
                height={200}
              />
              <p className="text-[11px] font-bold leading-tight uppercase text-foreground break-words">
                Hola! I&apos;m Abhishek. Drop me a note and I&apos;ll ping you back directly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3 p-3 sm:p-4">
              {/* Invisible Honeypot Field for Automated Spambots */}
              <input
                type="text"
                name="company_name_hp"
                value={botCheck}
                onChange={(e) => setBotCheck(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="YOUR NAME"
                disabled={isLoading}
                maxLength={80}
                className="w-full border-2 border-foreground bg-background px-3 py-2 text-xs font-bold uppercase placeholder:text-muted-foreground focus:bg-brutal-yellow/20 focus:outline-none disabled:opacity-50"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="YOUR EMAIL"
                disabled={isLoading}
                maxLength={100}
                className="w-full border-2 border-foreground bg-background px-3 py-2 text-xs font-bold uppercase placeholder:text-muted-foreground focus:bg-brutal-yellow/20 focus:outline-none disabled:opacity-50"
                required
              />
              <input
                type="text"
                name="tgUsername"
                value={formData.tgUsername}
                onChange={handleChange}
                placeholder="TELEGRAM USERNAME (WITHOUT @)"
                disabled={isLoading}
                maxLength={50}
                className="w-full border-2 border-foreground bg-background px-3 py-2 text-xs font-bold uppercase placeholder:text-muted-foreground focus:bg-brutal-yellow/20 focus:outline-none disabled:opacity-50"
              />
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="SUBJECT"
                disabled={isLoading}
                maxLength={120}
                className="w-full border-2 border-foreground bg-background px-3 py-2 text-xs font-bold uppercase placeholder:text-muted-foreground focus:bg-brutal-yellow/20 focus:outline-none disabled:opacity-50"
                required
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="YOUR MESSAGE..."
                rows={3}
                disabled={isLoading}
                maxLength={1500}
                className="w-full border-2 border-foreground bg-background px-3 py-2 text-xs font-bold uppercase placeholder:text-muted-foreground focus:bg-brutal-yellow/20 focus:outline-none resize-none disabled:opacity-50"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="brutal-btn w-full bg-brutal-lime py-2.5 text-xs font-black uppercase text-black tracking-wider hover:bg-brutal-yellow transition disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? "SENDING..." : "SEND MESSAGE"}
              </button>
            </form>
          </div>

          {successMessage && (
            <div className="fixed bottom-24 right-4 sm:right-6 z-[10001] border-3 sm:border-4 border-foreground bg-brutal-lime p-3 text-xs font-black uppercase text-black shadow-brutal-lg animate-bounce">
              ✓ {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="fixed bottom-24 right-4 sm:right-6 z-[10001] border-3 sm:border-4 border-foreground bg-brutal-pink p-3 text-xs font-black uppercase text-white shadow-brutal-lg">
              ✕ {errorMessage}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Contact;
