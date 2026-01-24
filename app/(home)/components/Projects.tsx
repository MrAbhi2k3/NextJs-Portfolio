import React from 'react';
import { TiHtml5 } from "react-icons/ti";
import { FaCss3Alt, FaReact } from "react-icons/fa6";
import { FaJsSquare, FaDocker, FaPython, FaNodeJs } from "react-icons/fa";
import { SiMongodb, SiExpress, SiTailwindcss, SiKoyeb } from "react-icons/si";
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { DirectionAwareHover } from '@/components/ui/direction-aware-hover';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';

const Projects = () => {
    const projects = [
        {
            title: 'Canva Bolgs',
            tech: [TiHtml5, FaCss3Alt, SiTailwindcss, FaJsSquare],
            link: 'https://github.com/MrAbhi2k3/Canva-Premium-Invites',
            cover: 'https://i.ibb.co/S3j21TN/img3.png',
            background: 'bg-gradient-to-r from-blue-500 to-red-700',
        },
        {
            title: 'Recipe Sharing Community',
            tech: [SiMongodb, SiExpress, FaReact, FaNodeJs],
            link: 'https://github.com/MrAbhi2k3/RecipeSharingCommunity',
            cover: 'https://i.ibb.co/smdcqT3/img4.png',
            background: 'bg-gradient-to-r from-gray-500 to-yellow-700',
        },
        {
            title: 'Telegram FIlestrore Bot',
            tech: [FaPython, FaDocker, SiKoyeb],
            link: 'https://github.com/MrAbhi2k3/TG-FileStore',
            cover: 'https://i.ibb.co/cTYbGLR/img2.png',
            background: 'bg-gradient-to-r from-yellow-500 to-yellow-700',
        },
        {
            title: 'Music WebApp',
            tech: [SiMongodb, SiExpress, FaReact, FaNodeJs],
            link: 'https://github.com/MrAbhi2k3/Music-webApp',
            cover: 'https://i.ibb.co/025wKt3/img1.png',
            background: 'bg-gradient-to-r from-green-500 to-green-700',
        },
        {
            title: 'Wallpapers Downloader',
            tech: [SiMongodb, SiExpress, FaReact, FaNodeJs],
            link: 'https://wallpapers.teleroidgroup.store',
            cover: 'https://i.ibb.co/025wKt3/img1.png',
            background: 'bg-gradient-to-r from-green-500 to-purple-700',
        },
        {
            title: 'Instagram Downloader',
            tech: [SiMongodb, SiExpress, FaReact, FaNodeJs],
            link: 'https://instadownloader.teleroidgroup.store',
            cover: 'https://i.ibb.co/025wKt3/img1.png',
            background: 'bg-gradient-to-r from-pink-500 to-yellow-700',
        },
    ];

    const words = `Here are some of the projects I have worked on:`;
    return (
        <div className='py-10 p-5 sm:p-10 px-10 overflow-hidden'>
            <div className='text-center mb-6'>
                <TextGenerateEffect className="text-s md:text-xl font-sans text-gray-600 mb-2" words={words}/>
                <h1 className='text-4xl md:text-5xl font-extrabold font-sans border-b-2 border-green-500 inline-block -rotate-3'>Projects</h1>
            </div>

            <div className='flex flex-wrap justify-center pt-20 gap-10'>
                {projects.map((project, index) => {
                    return (
                        <Link href={project.link} key={index} className='w-full sm:w-1/2 lg:w-1/3'>
                            <div className={cn("p-5 rounded-md", project.background)}>
                                <DirectionAwareHover
                                    imageUrl={project.cover}
                                    className='w-full h-auto space-y-5 cursor-pointer'
                                >
                                    <div className='space-y-5'>
                                        <h1 className='text-xl font-bold'>{project.title}</h1>
                                        <div className='flex items-center justify-center gap-5'>
                                            {project.tech.map((Icon, index) => {
                                                return <Icon key={index} className='w-4 h-4 text-white' />;
                                            })}
                                        </div>
                                    </div>
                                </DirectionAwareHover>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default Projects;
