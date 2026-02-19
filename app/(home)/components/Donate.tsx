import Link from "next/link";
import { FaBtc, FaCoffee, FaPaypal, FaRupeeSign } from "react-icons/fa";
import { RiTelegramLine } from "react-icons/ri";
import { SiGithubsponsors } from "react-icons/si";

const sponsorLinks = [
  {
    title: "UPI",
    description: "Quick local support",
    href: "https://sponsorsde.vercel.app/upi",
    Icon: FaRupeeSign,
  },
  {
    title: "GitHub Sponsors",
    description: "Monthly or one-time",
    href: "https://github.com/sponsors/MrAbhi2k3",
    Icon: SiGithubsponsors,
  },
  {
    title: "PayPal",
    description: "International payments",
    href: "https://sponsorsde.vercel.app/paypal",
    Icon: FaPaypal,
  },
  {
    title: "Crypto",
    description: "Wallet based donation",
    href: "https://sponsorsde.vercel.app/crypto",
    Icon: FaBtc,
  },
  {
    title: "Ko-fi",
    description: "Buy me a coffee",
    href: "https://ko-fi.com/MrAbhi2k3",
    Icon: FaCoffee,
  },
  {
    title: "Telegram Stars",
    description: "Sponsor through Telegram",
    href: "https://t.me/DonateXRobot",
    Icon: RiTelegramLine,
  },
];

const Donate = () => {
  return (
    <section className="mx-auto mt-12 max-w-5xl" id="sponsors">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-primary">Sponsors</p>
        <h2 className="text-3xl font-bold sm:text-4xl">Support my work</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sponsorLinks.map(({ title, description, href, Icon }) => (
          <Link
            key={title}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm transition hover:-translate-y-0.5 hover:bg-secondary"
          >
            <Icon className="h-6 w-6 text-primary" />
            <p className="mt-3 text-base font-bold">{title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Donate;
