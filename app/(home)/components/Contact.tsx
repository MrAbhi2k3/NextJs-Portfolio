"use client";

import Image from "next/image";
import React, { useState } from "react";
import { SiChatbot } from "react-icons/si";
import { FaTimes } from "react-icons/fa";
import { GlowingEffect } from "../../../components/ui/glowing-effect"

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, email, tgUsername, subject, message } = formData;

    const MessageSent = `Name: ${name}\n\nEmail & Username of User \nEmail: ${email}\nTelegram Username: @${tgUsername}\n\nReason of Messaging \nSubject: ${subject}\n\nDetails Reason of Message \nMessage: ${message}`;
    const BotToken = "5228779518:AAEmEY8_dHJ4LXOefuPpWzXnEWHSnSrwA_0";
    const ChatID = "-1002143952930";
    const msglinker = `https://api.telegram.org/bot${BotToken}/sendMessage`;

    try {
      await fetch(msglinker, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: ChatID, text: MessageSent }),
      });

      setSuccessMessage("Message sent to MrAbhi2k3!");
      setFormData({ name: "", email: "", tgUsername: "", subject: "", message: "" });
      
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error)
    {
      console.error(error);
      setSuccessMessage("Failed to send message. Try again.");
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsFormOpen(!isFormOpen)}
        className="fixed bottom-5 right-5 z-[60] cursor-pointer rounded-full bg-blue-600 p-4 text-white shadow-lg transition hover:bg-blue-700"
      >
        <SiChatbot className="w-6 h-6" />
      </button>

      {isFormOpen && (
        <div className="fixed inset-0 z-[70] flex items-end justify-end bg-gray-800 bg-opacity-50 p-4">
          <div className="bg-gray-900 text-white rounded-lg shadow-lg w-full max-w-sm relative overflow-hidden">
            <div className="bg-gray-800 p-4 flex justify-between items-center">
              <h2 className="text-xl font-sans font-bold">Send Us a Message</h2>
              <button onClick={() => setIsFormOpen(false)} className="text-white hover:text-gray-300">
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 flex items-center space-x-4">
              <Image src="https://i.ibb.co/0yMtdqqK/sticker-boy-coding-computer-anime-s-creative-design-bold-line-cute-kawaii-st-655090-454640.jpg" alt="Chatbot" className="w-12 h-12 rounded-full" width={200} height={200} />
              <p className="text-xs font-sans font-semibold">Hola! I&apos;m Abhishek. Drop me a message and we&apos;ll get back to you ASAP!</p>
            </div>
            <GlowingEffect glow variant="default" className="absolute inset-0"/>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required/>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your Email" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required/>
              <input type="text" name="tgUsername" value={formData.tgUsername} onChange={handleChange} placeholder="Telegram Username" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required/>
              <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required/>
              <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Your Message" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required/>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition">Send Message</button>
            </form>
          </div>
          {successMessage && (
            <div className="fixed bottom-10 right-10 bg-green-500 text-white p-4 rounded-lg shadow-lg">{successMessage}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Contact;
