import React from 'react';
import Link from 'next/link';
import { FaGithub , FaInstagram, FaTelegram  } from "react-icons/fa";
// import { FaTelegram } from "react-icons/fa6";

const Navbar = () => {
    const socials = [
        {
            label: 'GitHub',
            link: 'https://github.com/MrAbhi2k3',
            Icon: FaGithub,
        },
        {
            label: 'Instagram',
            link: 'https://www.instagram.com/mrabhi_2k3/',
            Icon: FaInstagram,
        },
        {
            label: 'Telegram',
            link: 'https://t.me/MrAbhi2k3',
            Icon: FaTelegram,
        }
    ];

    return (
        <nav className='py-10 flex justify-between items-center'>
            <h1 className='text=2xl font-bold underline underline-offset-8 decoration-green-500 -rotate-2'>
                <a className="text-lg" href="/">MrAbhi2k3. 🧑‍💻</a>
                
                </h1>
            <div className='flex items-center gap-5'>
                {socials.map((social, index) => {
                    const Icon = social.Icon;

                    return (
                        <Link 
                            href={social.link} 
                            key={index} 
                            aria-label={social.label} 
                            target="_blank" 
                        >
                            <Icon className='text-4xl w-8 h-8 hover:scale-125 transition-transform duration-200 shadow-md shadow-gray-500 rounded-full p-2 hover:shadow-lg hover:shadow-gray-700' />
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default Navbar;
