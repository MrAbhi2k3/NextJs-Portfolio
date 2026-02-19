import { FaGithub, FaInstagram, FaTelegram } from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
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
      label: "Telegram",
      link: "https://t.me/MrAbhi2k3",
      Icon: FaTelegram,
    },
  ];

  return (
    <footer className="border-t border-border/80 bg-card/60 py-6">
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <div className="mb-4 flex space-x-4">
          {socials.map((social) => {
            const Icon = social.Icon;

            return (
              <Link
                href={social.link}
                key={social.label}
                aria-label={social.label}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border bg-background p-2.5 text-foreground/80 transition hover:-translate-y-0.5 hover:bg-secondary hover:text-foreground"
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            );
          })}
        </div>

        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Owned by{" "}
          <Link
            className="font-semibold text-foreground transition hover:text-primary"
            href="https://github.com/MrAbhi2k3"
          >
            @MrAbhi2k3
          </Link>
          . All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
