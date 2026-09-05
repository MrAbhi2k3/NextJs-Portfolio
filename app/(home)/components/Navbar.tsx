"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Moon, Sun } from "lucide-react";

const Navbar = () => {
  const { resolvedTheme, setTheme } = useTheme();

  const socials = [
    {
      label: "GitHub",
      link: "https://github.com/MrAbhi2k3",
      Icon: FaGithub,
    },
    {
      label: "LinkedIn",
      link: "https://www.linkedin.com/in/KumaarAbhishek/",
      Icon: FaLinkedin,
    },
    {
      label: "Instagram",
      link: "https://www.instagram.com/mrabhi_2k3/",
      Icon: FaInstagram,
    },
  ];

  const isDark = resolvedTheme === "dark";

  return (
    <nav className="sticky top-2 z-30 mb-8 w-full">
      <div className="mx-auto flex w-full flex-wrap items-center justify-between gap-2 border-2 sm:border-4 border-foreground bg-card p-2.5 sm:p-4 shadow-brutal sm:shadow-brutal-lg">
        <Link
          href="/"
          className="bg-primary px-2 sm:px-3 py-1 text-sm sm:text-xl font-black tracking-tight text-primary-foreground border-2 border-foreground uppercase transition hover:translate-x-0.5 hover:translate-y-0.5"
        >
          MrAbhi2k3_
        </Link>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {socials.map((social) => {
            const Icon = social.Icon;

            return (
              <Link
                href={social.link}
                key={social.label}
                aria-label={social.label}
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-foreground bg-secondary p-1.5 sm:p-2 text-secondary-foreground shadow-brutal-sm transition hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0"
              >
                <Icon className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="Toggle theme"
            className="border-2 border-foreground bg-accent p-1.5 sm:p-2 text-accent-foreground shadow-brutal-sm transition hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0"
          >
            {isDark ? (
              <Sun className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
            ) : (
              <Moon className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
