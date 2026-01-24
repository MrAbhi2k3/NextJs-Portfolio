"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FaPaypal,
  FaBtc,
  FaRupeeSign,
  FaCoffee,
} from "react-icons/fa";
import { RiTelegramLine } from "react-icons/ri";
import { SiGithubsponsors } from "react-icons/si";
import Image from "next/image";
import Link from "next/link";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { FloatingDock } from "@/components/ui/floating-dock";

const MagneticButton = ({
  href,
  text,
  icon,
}: {
  href: string;
  text: string;
  icon: React.ReactNode;
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className="w-full"
    >
      <Link href={href}>
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 12 }}
          whileHover={{ x: 6 }}
          className="relative w-full h-12 rounded-full bg-black hover:bg-zinc-800 text-white flex items-center justify-between px-5 font-bold text-sm overflow-hidden"
        >
          <span>{text}</span>
          <motion.span
            whileHover={{ scale: 1.2, rotate: 10 }}
            className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center"
          >
            {icon}
          </motion.span>
        </motion.div>
      </Link>
    </motion.div>
  );
};

const Donate = () => {
  const links = [
    {
      title: "UPI",
      icon: <FaRupeeSign className="h-full w-full text-white" />,
      href: "https://sponsorsde.vercel.app/upi",
    },
    {
      title: "GitHub Sponsors",
      icon: <SiGithubsponsors className="h-full w-full text-white" />,
      href: "https://github.com/sponsors/MrAbhi2k3",
    },
    {
      title: "Bitcoin",
      icon: <FaBtc className="h-full w-full text-white" />,
      href: "https://sponsorsde.vercel.app//crypto",
    },
    {
      title: "Home",
      icon: (
        <Image
          src="https://i.postimg.cc/1RpnQsMg/Hacker-PNG-Image.webp"
          width={40}
          height={40}
          alt="logo"
        />
      ),
      href: "/",
    },
    {
      title: "Paypal",
      icon: <FaPaypal className="h-full w-full text-white" />,
      href: "https://sponsorsde.vercel.app/paypal",
    },
    {
      title: "Coffee",
      icon: <FaCoffee className="h-full w-full text-white" />,
      href: "https://ko-fi.com/MrAbhi2k3",
    },
    {
      title: "Telegram",
      icon: <RiTelegramLine className="h-full w-full text-white" />,
      href: "https://t.me/DonateXRobot",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-black text-white">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-lg text-neutral-400"
      >
        Want to be one of my sponsors or donors?
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl md:text-5xl font-extrabold mt-4 mb-12"
      >
        Donate
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        <BackgroundGradient className="rounded-[22px] bg-zinc-900 p-6">
          <Image
            src="https://i.postimg.cc/W14PXwhN/upi.png"
            alt="UPI"
            width={400}
            height={400}
            className="object-contain"
          />
          <div className="mt-6 space-y-4">
            <h2 className="text-2xl font-semibold text-center">UPI</h2>
            <p className="text-sm text-neutral-400 text-center">
              Scan QR or use UPI ID
            </p>
            <MagneticButton
              href="https://sponsorsde.vercel.app/upi"
              text="Donate via UPI"
              icon={<FaRupeeSign className="text-xl" />}
            />
          </div>
        </BackgroundGradient>

        <BackgroundGradient className="rounded-[22px] bg-zinc-900 p-6">
          <Image
            src="https://i.postimg.cc/sXY8VMvH/btclogo.webp"
            alt="Crypto"
            width={400}
            height={400}
            className="object-contain"
          />
          <div className="mt-6 space-y-4">
            <h2 className="text-2xl font-semibold text-center">Crypto</h2>
            <p className="text-sm text-neutral-400 text-center">
              Donate using cryptocurrency
            </p>
            <MagneticButton
              href="https://sponsorsde.vercel.app/crypto"
              text="Donate via Crypto"
              icon={<FaBtc className="text-xl" />}
            />
          </div>
        </BackgroundGradient>

        <BackgroundGradient className="rounded-[22px] bg-zinc-900 p-6">
          <Image
            src="https://i.postimg.cc/SxRwWQvj/paypal.webp"
            alt="Paypal"
            width={400}
            height={400}
            className="object-contain"
          />
          <div className="mt-6 space-y-4">
            <h2 className="text-2xl font-semibold text-center">PayPal</h2>
            <p className="text-sm text-neutral-300 text-center">
              Secure PayPal donation
            </p>
            <MagneticButton
              href="https://sponsorsde.vercel.app/paypal"
              text="Donate via PayPal"
              icon={<FaPaypal className="text-xl" />}
            />
          </div>
        </BackgroundGradient>
      </div>

      <div className="mt-24 bg-black/30 rounded-full p-4">
        <FloatingDock items={links} mobileClassName="translate-y-16" />
      </div>
    </div>
  );
};

export default Donate;
