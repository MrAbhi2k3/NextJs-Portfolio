import React from 'react';
import { FaGithub, FaInstagram, FaTelegram } from 'react-icons/fa';
import Link from 'next/link';

const Footer = () => {
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
    },
  ];

  return (
    <div className='border-t-2 py-4'>
      <div className='max-w-5xl mx-auto flex flex-col items-center text-center'>
        <div className='flex space-x-6 mb-4'>
          {socials.map((social, index) => {
            const Icon = social.Icon;

            return (
              <Link
                href={social.link}
                key={index}
                aria-label={social.label}
                target='_blank'
                rel='noopener noreferrer'
              >
                <Icon className='text-4xl w-8 h-8 hover:scale-125 transition-transform duration-200 shadow-md shadow-blue-500 rounded-full p-2 hover:shadow-lg hover:shadow-blue-700' />
              </Link>
            );
          })}
        </div>
        <p className='text-gray-500 text-s font-mono'>
          © {new Date().getFullYear()} Owned by <Link className='hover:text-gray-400 text-white' href="https://github.com/MrAbhi2k3">@MrAbhi2k3</Link>. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
