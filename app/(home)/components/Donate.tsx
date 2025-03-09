"use client";
import React from 'react';
import { FloatingDock } from '@/components/ui/floating-dock';
import { 
    FaPaypal,
    FaBtc,
    FaRupeeSign,
    FaCoffee,
 } from "react-icons/fa";
import { RiTelegramLine } from "react-icons/ri";
import { SiGithubsponsors } from "react-icons/si";
import Image from 'next/image';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import Link from 'next/link';

const Donate = () => {
  const links = [
    {
      title: "Donate via UPI",
      icon: <FaRupeeSign className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "https://donate.mrabhi2k3.me/upi",
    },
    {
      title: "Donate via GitHub Sponsors",
      icon: <SiGithubsponsors className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "https://github.com/sponsors/MrAbhi2k3",
    },
    {
      title: "Donate via Bitcoin",
      icon: <FaBtc className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "https://donate.mrabhi2k3.me/crypto",
    },
    {
      title: "Thank You For Your Support! 🙏",
      icon: (
        <Image
          src="https://i.ibb.co/xKTF703L/pngtree-programmer-it-developer-png-image-13520483.png"
          width={40}
          height={40}
          alt="Aceternity Logo"
        />
      ),
      href: "/",
    },
    {
      title: "Donate via Paypal",
      icon: <FaPaypal className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "https://donate.mrabhi2k3.me/paypal",
    },
    {
      title: "Buy Me A Coffee",
      icon: <FaCoffee className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "https://ko-fi.com/MrAbhi2k3",
    },
    {
      title: "Telegram Stars",
      icon: <RiTelegramLine className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "https://t.me/DonateXRobot",
    },
  ];

  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-4">
        <p className='font-sans text-xl'> Want to be My One of the Sponsors or Donor</p>
      <h1 className="text-4xl font-extrabold mb-8 mt-4 font-sans">Donate</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">

        {/* UPI Section */}
        <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
        <Image
          src={`https://i.ibb.co/q3kgvW8g/upi.png`}
          alt="jordans"
          height="400"
          width="400"
          className="object-contain"
        />
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-4">UPI</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Scan the QR code or use UPI ID to donate.
            </p>
            <button className="rounded-full w-full h-12 pl-4 pr-1 py-1 text-white flex items-center space-x-1 bg-black mt-4 text-xs font-bold font-sans dark:bg-zinc-800">
              <Link href='https://donate.mrabhi2k3.me/upi'>
              <span>Donate via UPI</span>
                </Link>
              <span className="bg-zinc-700 rounded-full w-10 h-10 text-[0.6rem] px-2 py-0 text-white">
                <FaRupeeSign className='text-xl mt-2'/>
              </span>
            </button>
          </div>
        </BackgroundGradient>

        {/* Crypto Section */}
        <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
        <Image
          src={`https://i.ibb.co/JWCxVzg4/worldwide-coin-3d-icon-download-in-png-blend-fbx-gltf-file-formats-crypto-world-and-network-cryptocu.png`}
          alt="jordans"
          height="400"
          width="400"
          className="object-contain"
        />
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-4">Crypto</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Send cryptocurrency to the provided wallet address.
            </p>
            <button className="rounded-full w-full h-12 pl-4 pr-1 py-1 text-white flex items-center space-x-1 bg-black mt-4 text-xs font-bold font-sans dark:bg-zinc-800">
              <Link href='https://donate.mrabhi2k3.me/crypto'>
              <span>Donate via Crypto</span>
                </Link>
              <span className="bg-zinc-700 w-10 h-10 rounded-full text-[0.6rem] px-2 py-0 text-white">
                <FaBtc className='text-xl mt-2'/>
              </span>
            </button>
          </div>
        </BackgroundGradient>

        {/* PayPal Section */}
        <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
        <Image
          src={`https://i.ibb.co/20HmgXyn/Paypal-Icon-Transparent-File.png`}
          alt="jordans"
          height="400"
          width="400"
          className="object-contain"
        />
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-4">PayPal</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Use PayPal to make a donation.
            </p>
            <button className="rounded-full w-full h-12 pl-4 pr-1 py-1 text-white flex items-center space-x-1 bg-black mt-4 text-xs font-bold font-sans dark:bg-zinc-800">
              <Link href='https://donate.mrabhi2k3.me/paypal'>
              <span>Donate via PayPal</span>
                </Link>
              <span className="bg-zinc-700 w-10 h-10 rounded-full text-[0.6rem] px-2 py-0 text-white">
                <FaPaypal className='text-xl mt-2'/>
              </span>
            </button>
          </div>
        </BackgroundGradient>
      </div>
      <div className="mt-20 z-20">
        <FloatingDock
          mobileClassName="translate-y-20"
          items={links}
        />
      </div>
    </div>
  );
};

export default Donate;