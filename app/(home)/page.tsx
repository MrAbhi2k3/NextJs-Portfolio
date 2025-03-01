import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Footer from './components/Footer';
import About from './components/About';
import { BackgroundBeamsWithCollision } from '@/components/ui/background-beams-with-collision';
import Header from './components/Header';
import Contact from './components/Contact';

const Page = () => {
  return (
    <div className='h-full bg-black text-white overflow-hidden'>
        <Header />
        <BackgroundBeamsWithCollision className="absolute inset-0 z-0">
          </BackgroundBeamsWithCollision>
      
      {/* Main content area */}
      <div className='relative z-10 bg-grid-black/[0.2] dark:bg-grid-white/[0.05] min-h-screen'>
        <div className='max-w-7xl mx-auto p-5'>
          <Navbar />
          {/* <hr className='border-t-2 -mt-8 border-gray-500' /> */}
          <HeroSection />
        </div>
          
          {/* About section */}

                    <About />
        
        <div className='h-10 xl:h-32 bg-gradient-to-t from-black absolute -bottom-5 left-0 xl:bottom-0 w-full'></div>
      </div>

      {/* Skills and Projects sections */}
      <div className='max-w-7xl mx-auto p-5 mt-20 gap-y-12 flex flex-col z-10'>
        <Skills />
        <Projects />
      </div>

      {/* Contact page */}
      <div>
        <Contact />
      </div>

      {/* Footer */}
      <div className='mt-8 pt-12 z-10'>
        <Footer />
      </div>



    </div>
  );
}

export default Page;
