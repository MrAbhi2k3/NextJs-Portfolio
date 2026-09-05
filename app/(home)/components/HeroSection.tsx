import Image from "next/image";
import Resume from "./Resume";
import { FaEnvelope, FaBolt, FaTerminal, FaCode } from "react-icons/fa";

const HeroSection = () => {
  return (
    <section className="brutal-card mx-auto w-full max-w-5xl bg-card p-4 sm:p-7 md:p-9 mb-10 overflow-hidden">
      <div className="grid items-center gap-6 md:grid-cols-[1.35fr,1fr]">
        <div className="space-y-4 sm:space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 border-2 border-foreground bg-brutal-lime px-2.5 py-1 text-[10px] sm:text-xs font-black uppercase text-black shadow-brutal-sm">
              <FaBolt className="h-3 w-3 animate-pulse" />
              <span>FULL STACK DEVELOPER</span>
            </div>
            <div className="inline-flex items-center gap-1.5 border-2 border-foreground bg-brutal-cyan px-2 py-1 text-[10px] sm:text-xs font-black uppercase text-black shadow-brutal-sm">
              <FaTerminal className="h-2.5 w-2.5" />
              <span>SYSTEMS & APIS</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[3rem] font-black leading-[1.08] tracking-tight uppercase break-words">
            BUILDING WEBAPPS, ANDROID APPS, LINUX IMAGES & REST APIS.
          </h1>

          <div className="border-l-4 border-primary pl-3 sm:pl-4 py-1 space-y-2">
            <p className="text-xs sm:text-base font-bold leading-relaxed text-foreground break-words">
              Hi, I am <span className="underline decoration-primary decoration-4">Abhishek Kumar</span>.
            </p>
            <p className="text-xs sm:text-sm font-semibold leading-relaxed text-muted-foreground break-words">
              Architecting fast web applications, cross-platform Android apps, optimized custom Linux OS distributions, and scalable high-concurrency REST APIs engineered for performance, resilience, and real-world deployment.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-2">
            <Resume />

            <a
              href="mailto:abhishek.kumar.idev@gmail.com"
              className="brutal-btn bg-brutal-yellow text-black px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-black tracking-wider gap-2 break-all cursor-pointer relative z-20 pointer-events-auto select-auto"
            >
              <FaEnvelope className="h-3.5 w-3.5 shrink-0" />
              <span>EMAIL ME</span>
            </a>
          </div>

          <div className="pt-2">
            <a
              href="mailto:abhishek.kumar.idev@gmail.com"
              className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-mono font-bold text-muted-foreground hover:text-foreground underline underline-offset-4 break-all cursor-pointer relative z-20"
            >
              <FaCode className="h-3 w-3 shrink-0" />
              <span>abhishek.kumar.idev@gmail.com</span>
            </a>
          </div>
        </div>

        <div className="mx-auto flex justify-center w-full max-w-[240px] sm:max-w-[270px]">
          <div className="relative border-3 sm:border-4 border-foreground bg-brutal-pink p-2 sm:p-3 shadow-brutal-lg rotate-1 hover:rotate-0 transition-transform w-full">
            <Image
              src="https://i.postimg.cc/VkJVJGJC/circulardp.webp"
              alt="Abhishek Kumar"
              width={260}
              height={260}
              className="border-2 border-foreground object-cover aspect-square w-full filter contrast-110"
              priority
            />
            <div className="mt-2 border-2 border-foreground bg-black px-2 py-1 text-center text-[10px] sm:text-xs font-black uppercase text-white tracking-widest">
              ABHISHEK KUMAR
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
