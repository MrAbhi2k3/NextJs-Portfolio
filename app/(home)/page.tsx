"use client";

import Footer from "./components/Footer";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import Services from "./components/Services";
import Navbar from "./components/Navbar";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Certifications from "./components/Certifications";
import Achievements from "./components/Achievements";
import Education from "./components/Education";
import Donate from "./components/Donate";
import Contact from "./components/Contact";

const Page = () => {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background text-foreground transition-colors duration-150">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-20 dark:opacity-25 brutal-dots-bg" />

      <div className="relative z-10">
        <Header />

        <main className="mx-auto w-full max-w-7xl px-3 sm:px-6 md:px-8 pt-4 pb-6">
          <Navbar />
          <HeroSection />
          <Services />
          <Experience />
          <Skills />
          <Projects />
          <Certifications />
          <Achievements />
          <Education />
          <Donate />
        </main>

        <Contact />

        <Footer />
      </div>
    </div>
  );
};

export default Page;
