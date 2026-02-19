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
      label: "Instagram",
      link: "https://www.instagram.com/mrabhi_2k3/",
      Icon: FaInstagram,
    },
    {
      label: "LinkedIn",
      link: "https://www.linkedin.com/in/KumaarAbhishek/",
      Icon: FaLinkedin,
    },
  ];

  const isDark = resolvedTheme === "dark";

  return (
    <nav className="sticky top-12 z-30">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between rounded-full border border-border/80 bg-card/90 px-4 py-3 shadow-md backdrop-blur">
        <Link href="/" className="text-base font-bold sm:text-lg">
          MrAbhi2k3.
        </Link>

        <div className="flex items-center gap-2">
          {socials.map((social) => {
            const Icon = social.Icon;

            return (
              <Link
                href={social.link}
                key={social.label}
                aria-label={social.label}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-2 text-foreground/80 transition hover:bg-secondary hover:text-foreground"
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="Toggle theme"
            className="relative rounded-full border border-border bg-secondary p-2 text-foreground transition hover:opacity-85"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 sm:h-5 sm:w-5" />
            <Moon className="absolute left-2 top-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 sm:left-2 sm:top-2 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
