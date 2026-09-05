import { FaGithub, FaInstagram, FaLinkedin, FaEnvelope } from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
  const socials = [
    {
      label: "GitHub",
      link: "https://github.com/MrAbhi2k3",
      Icon: FaGithub,
      bg: "bg-brutal-yellow",
    },
    {
      label: "LinkedIn",
      link: "https://www.linkedin.com/in/KumaarAbhishek/",
      Icon: FaLinkedin,
      bg: "bg-brutal-cyan",
    },
    {
      label: "Instagram",
      link: "https://www.instagram.com/mrabhi_2k3/",
      Icon: FaInstagram,
      bg: "bg-brutal-pink",
    },
    {
      label: "Email",
      link: "mailto:abhishek.kumar.idev@gmail.com",
      Icon: FaEnvelope,
      bg: "bg-brutal-lime",
    },
  ];

  return (
    <footer className="mt-16 border-t-4 border-foreground bg-card py-8 px-4">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
        <div>
          <div className="inline-block border-2 border-foreground bg-primary px-3 py-1 text-sm font-black uppercase text-primary-foreground shadow-brutal-sm">
            MrAbhi2k3
          </div>
          <p className="mt-2 text-xs sm:text-sm font-bold text-muted-foreground break-all">
            abhishek.kumar.idev@gmail.com
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {socials.map((social) => {
            const Icon = social.Icon;

            return (
              <Link
                href={social.link}
                key={social.label}
                aria-label={social.label}
                target="_blank"
                rel="noopener noreferrer"
                className={`border-2 border-foreground ${social.bg} p-2 text-black shadow-brutal-sm transition hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0`}
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            );
          })}
        </div>

        <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">
          © {new Date().getFullYear()}{" "}
          <Link
            className="text-foreground underline hover:text-primary"
            href="https://github.com/MrAbhi2k3"
          >
            MrAbhi2k3
          </Link>
          . ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
