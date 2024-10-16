import React from 'react';
import Image from 'next/image';

const About = () => {
  return (
    <section className="py-12 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 border-green-500">
          <h2 className="text-4xl font-bold border-b-2 border-green-500 inline-block -rotate-3">ABOUT ME</h2>
          
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 gap-y-8 px-10 mx-10">
          <div className="md:col-span-1">
          {/* <p className="text-lg mb-6 border-b-2 border-indigo-500 inline-block mt-8 pt-8 "> */}
            <p className="mb-7 text-2xl tracking-tight py-5 border-b-2 font-extrabold text-white">
            So, Let&apos;s Know About Me :
          </p>
            <p className="mb-3 font-sans font-normal text-justify text-xs text-neutral-300">
            I&apos;m a passionate Web Developer and App Developer with a keen interest in building engaging and user-friendly experiences.
            </p>
            <p className="mb-3 font-sans font-normal text-justify text-xs text-neutral-300">
            My journey began with a love for both technology and creativity. I believe in crafting digital experiences that not only function flawlessly but are also visually captivating. My expertise spans various fields, including web development, mobile app development, and user interface design.
            </p>
            <p className="mb-3 font-sans font-normal text-justify text-xs text-neutral-300">
              I&apos;m constantly seeking new challenges and learning new skills. I love working with different technologies and exploring new ways to push the boundaries of what&apos;s possible.
            </p>
            <p className="mb-3 font-sans font-normal text-justify text-xs text-neutral-300">
              I&apos;m also a huge enthusiast of WebDevelopment & CyberSecurity. I believe that life is about embracing experiences and constantly learning and growing.
            </p>
          </div>

          <div className="md:col-span-1 flex flex-col items-center md:flex-row justify-center gap-4">
            <Image 
              src="https://i.ibb.co/ZJ53xN8/50097024bab57d94a12e5b9267f75aba95daf0d5-high.webp"
              alt="First Image"
              width={300}
              height={300}
              className="w-60 h-96 mb-16 rounded-lg shadow-lg"
            />
            <Image 
              src="https://i.ibb.co/ZJ53xN8/50097024bab57d94a12e5b9267f75aba95daf0d5-high.webp"
              alt="Second Image"
              width={300}
              height={300}
              className="w-60 h-96 mt-16 rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
