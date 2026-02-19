"use client";

import Footer from "./components/Footer";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Donate from "./components/Donate";
import Contact from "./components/Contact";

const Page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      <Header />

      <main className="mx-auto w-full px-4 pb-10 pt-16 sm:px-6">
        <Navbar />
        <HeroSection />
        <Skills />
        <Projects />
        <Donate />
      </main>

      <Contact />

      <div className="mt-6">
        <Footer />
      </div>
    </div>
  );
};

export default Page;
