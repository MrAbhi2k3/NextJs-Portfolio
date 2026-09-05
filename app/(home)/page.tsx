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
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background text-foreground transition-colors duration-150">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-20 dark:opacity-25 brutal-dots-bg" />

      <div className="relative z-10">
        <Header />

        <main className="mx-auto w-full max-w-5xl px-2 sm:px-4 md:px-6 pt-4 pb-12">
          <Navbar />
          <HeroSection />
          <Skills />
          <Projects />
          <Donate />
        </main>

        <Contact />

        <Footer />
      </div>
    </div>
  );
};

export default Page;
