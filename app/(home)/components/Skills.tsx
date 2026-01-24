"use client";

import React from "react";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import {
  SiGit,
  SiReact,
  SiPython,
  SiTypescript,
  SiAdobephotoshop,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
} from "react-icons/si";
import { RiFirebaseFill } from "react-icons/ri";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

const words = "Here are the technologies and tools I am proficient in:";

const Skills = () => {
  const skills = [
    { text: "React", Icon: SiReact },
    { text: "Python", Icon: SiPython },
    { text: "Next.js", Icon: SiNextdotjs },
    { text: "TypeScript", Icon: SiTypescript },
    { text: "Git", Icon: SiGit },
    { text: "Adobe Photoshop", Icon: SiAdobephotoshop },
    { text: "Firebase", Icon: RiFirebaseFill },
    { text: "MongoDB", Icon: SiMongodb },
    { text: "MySQL", Icon: SiMysql },
  ];

  return (
    <section className="w-full py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <TextGenerateEffect
            className="text-sm md:text-lg font-sans text-gray-400 mb-4"
            words={words}
          />
          <h1 className="text-3xl md:text-5xl font-extrabold font-sans border-b-2 border-indigo-500 inline-block -rotate-2">
            Skills 🧑‍💻
          </h1>
        </div>

        {/* Skills Grid */}
        <HoverEffect
          items={skills}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        />
      </div>
    </section>
  );
};

export default Skills;
