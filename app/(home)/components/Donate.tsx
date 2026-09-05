import Link from "next/link";
import { FaBtc, FaCoffee, FaPaypal, FaRupeeSign } from "react-icons/fa";
import { RiTelegramLine } from "react-icons/ri";
import { SiGithubsponsors } from "react-icons/si";

const sponsorLinks = [
  {
    title: "UPI",
    description: "Instant Indian local support",
    href: "https://sponsorsde.vercel.app/upi",
    Icon: FaRupeeSign,
    bg: "bg-brutal-lime",
  },
  {
    title: "GitHub Sponsors",
    description: "Recurring or one-time pledge",
    href: "https://github.com/sponsors/MrAbhi2k3",
    Icon: SiGithubsponsors,
    bg: "bg-brutal-pink",
  },
  {
    title: "PayPal",
    description: "International USD/EUR payments",
    href: "https://sponsorsde.vercel.app/paypal",
    Icon: FaPaypal,
    bg: "bg-brutal-cyan",
  },
  {
    title: "Crypto",
    description: "Decentralized wallet transfer",
    href: "https://sponsorsde.vercel.app/crypto",
    Icon: FaBtc,
    bg: "bg-brutal-yellow",
  },
  {
    title: "Ko-fi",
    description: "Buy me a quick coffee boost",
    href: "https://ko-fi.com/MrAbhi2k3",
    Icon: FaCoffee,
    bg: "bg-brutal-orange",
  },
  {
    title: "Telegram Stars",
    description: "Sponsor seamlessly via Telegram",
    href: "https://t.me/DonateXRobot",
    Icon: RiTelegramLine,
    bg: "bg-brutal-cyan",
  },
];

const Donate = () => {
  return (
    <section className="mx-auto mt-8 sm:mt-12 mb-10 sm:mb-12 w-full max-w-5xl" id="sponsors">
      <div className="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-2 border-b-3 sm:border-b-4 border-foreground pb-2 sm:pb-3">
        <div>
          <span className="inline-block border-2 border-foreground bg-primary px-2 py-0.5 text-[10px] sm:text-xs font-black uppercase text-primary-foreground shadow-brutal-sm">
            BACKING
          </span>
          <h2 className="text-lg sm:text-2xl md:text-3xl font-black uppercase mt-1">
            SPONSOR MY CODE
          </h2>
        </div>
        <span className="text-[10px] sm:text-xs md:text-sm font-black uppercase opacity-70">
          [COMMUNITY POWERED]
        </span>
      </div>

      <div className="grid gap-3.5 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sponsorLinks.map(({ title, description, href, Icon, bg }) => (
          <Link
            key={title}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col justify-between border-2 sm:border-3 border-foreground bg-card p-3.5 sm:p-5 shadow-brutal transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg"
          >
            <div>
              <div className={`mb-2 sm:mb-3 inline-flex border-2 border-foreground ${bg} p-1.5 sm:p-2 text-black shadow-brutal-sm group-hover:rotate-6 transition-transform`}>
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <h3 className="text-sm sm:text-base font-black uppercase tracking-tight break-words">
                {title}
              </h3>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-muted-foreground break-words">
                {description}
              </p>
            </div>
            <div className="mt-3 sm:mt-4 flex items-center text-[10px] sm:text-xs font-black uppercase tracking-wider text-foreground group-hover:underline">
              <span>CONTRIBUTE →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Donate;
