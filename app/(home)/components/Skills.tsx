"use client";

import React from 'react';
import { HoverEffect } from '@/components/ui/card-hover-effect';
import {
    SiGit,
    SiReact,
    SiPython,
    SiTypescript,
    SiAdobephotoshop,
    SiMongodb,
    SiMysql,
    SiNextdotjs
} from "react-icons/si";
import { FaCloudscale } from "react-icons/fa";
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';

const words = `Here are the technologies and tools I am proficient in:`;

const Skills = () => {
    const skills = [
        { text: 'React', Icon: SiReact },
        { text: 'Python', Icon: SiPython },
        { text: 'Next.js', Icon: SiNextdotjs },
        { text: 'TypeScript', Icon: SiTypescript },
        { text: 'Git', Icon: SiGit },
        { text: 'Adobe Photoshop', Icon: SiAdobephotoshop },
        { text: 'Cloudscale', Icon: FaCloudscale },
        { text: 'MongoDB', Icon: SiMongodb },
        { text: 'MySQL', Icon: SiMysql },
    ];

    return (
        <div className="max-w-5xl mx-auto px-8">
            <div className="text-center mb-6">
                <TextGenerateEffect className="text-s md:text-xl text-gray-600 mb-2" words={words}/>
                <h1 className="text-4xl md:text-5xl font-extrabold border-b-2 border-indigo-500 inline-block -rotate-3">Skills 🧑‍💻</h1>
            </div>
            <div className="flex flex-wrap justify-center gap-8 mt-8">
                <HoverEffect items={skills} />
            </div>
        </div>
    );
};

export default Skills;
