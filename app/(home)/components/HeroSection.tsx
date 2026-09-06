import Image from "next/image";
import Resume from "./Resume";
import { FaEnvelope, FaBolt, FaTerminal, FaCode } from "react-icons/fa";

const HeroSection = () => {
  return (
    <section className="brutal-card mx-auto w-full min-h-[580px] lg:min-h-[640px] bg-card p-5 sm:p-8 md:p-12 mb-10 overflow-hidden flex flex-col justify-center">
      <div className="grid items-center gap-8 lg:gap-12 md:grid-cols-[1.35fr,1fr]">
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-1.5 border-2 border-foreground bg-brutal-lime px-3 py-1.5 text-xs font-black uppercase text-black shadow-brutal-sm">
              <FaBolt className="h-3.5 w-3.5 animate-pulse text-amber-900" />
              <span>FULL STACK DEVELOPER</span>
            </div>
            <div className="inline-flex items-center gap-1.5 border-2 border-foreground bg-brutal-cyan px-3 py-1.5 text-xs font-black uppercase text-black shadow-brutal-sm">
              <FaTerminal className="h-3 w-3" />
              <span>SYSTEMS & APIS</span>
            </div>
            <div className="inline-flex items-center gap-1.5 border-2 border-foreground bg-brutal-pink px-2.5 py-1.5 text-xs font-black uppercase text-black shadow-brutal-sm">
              <span>OPEN TO WORK</span>
            </div>
          </div>

          <p className="text-sm sm:text-base font-bold uppercase tracking-wider text-muted-foreground">
            Hi, my name is <span className="text-foreground font-black underline decoration-primary decoration-4">Abhishek Kumar</span>
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.6rem] font-black leading-[1.06] tracking-tight uppercase break-words">
            Architecting{" "}
            <span className="inline-block border-3 sm:border-4 border-foreground bg-brutal-yellow px-3 py-1 text-black shadow-brutal sm:shadow-brutal-lg -rotate-1 hover:rotate-0 transition-transform">
              Digital Systems
            </span>{" "}
            & High-Impact Apps
          </h1>

          <div className="space-y-3.5 max-w-2xl">
            <p className="text-base sm:text-lg md:text-xl font-semibold leading-relaxed text-muted-foreground break-words">
              I am an engineering-focused full stack software developer specializing in high-throughput REST APIs, resilient microservices, responsive web architectures, cross-platform Android solutions, and custom Linux image distributions.
            </p>
            <p className="text-sm sm:text-base md:text-[1.05rem] font-medium leading-relaxed text-muted-foreground/90 border-l-4 border-primary pl-3.5">
              With a background in both hands-on software development and corporate mentoring, I build production-grade systems—ranging from high-throughput REST APIs, intelligent Telegram bots, and responsive websites to full-featured webapps and cross-platform Android applications—merging brutalist, high-performance user interfaces with rock-solid server backends.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3.5 pt-2">
            <Resume />

            <a
              href="mailto:abhishek.kumar.idev@gmail.com"
              className="brutal-btn bg-brutal-yellow text-black px-5 sm:px-7 py-3 text-xs sm:text-sm font-black tracking-wider gap-2 break-all cursor-pointer relative z-20 pointer-events-auto select-auto"
            >
              <FaEnvelope className="h-4 w-4 shrink-0" />
              <span>EMAIL ME</span>
            </a>
          </div>

          <div className="pt-2">
            <a
              href="mailto:abhishek.kumar.idev@gmail.com"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono font-bold text-muted-foreground hover:text-foreground underline underline-offset-4 break-all cursor-pointer relative z-20"
            >
              <FaCode className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span>abhishek.kumar.idev@gmail.com</span>
            </a>
          </div>
        </div>

        <div className="relative mx-auto flex justify-center items-center w-full max-w-[300px] sm:max-w-[360px] py-6">
          {/* Animated Code Badge */}
          <div className="animate-hero-code absolute -top-4 -left-4 z-20 border-3 border-foreground bg-brutal-yellow px-3 py-1.5 text-sm font-black shadow-brutal text-black select-none pointer-events-none">
            &lt;/&gt;
          </div>

          {/* Animated Lightning Bolt */}
          <div className="animate-hero-bolt absolute -bottom-3 -left-3 z-20 flex h-12 w-12 items-center justify-center border-3 border-foreground bg-brutal-cyan text-black shadow-brutal rounded-full font-black text-lg select-none pointer-events-none">
            ⚡
          </div>

          {/* Animated Pro Badge */}
          <div className="animate-hero-pro absolute -bottom-4 -right-4 z-20 border-2 sm:border-3 border-foreground bg-brutal-lime px-3 py-1 text-xs font-black uppercase text-black shadow-brutal select-none pointer-events-none">
            ★ PRO DEVELOPER
          </div>

          <div className="relative w-full aspect-[4/5] rounded-[38px] border-4 border-foreground bg-gradient-to-br from-brutal-pink via-brutal-pink/90 to-primary/40 p-3 shadow-brutal-lg sm:shadow-brutal-xl overflow-hidden flex flex-col justify-end">
            <Image
              src="https://i.postimg.cc/VkJVJGJC/circulardp.webp"
              alt="Abhishek Kumar"
              width={380}
              height={460}
              className="w-full h-full object-cover rounded-[30px] border-2 border-foreground filter contrast-105"
              priority
            />
            <div className="absolute bottom-4 left-4 right-4 border-2 border-foreground bg-black/90 backdrop-blur-xs px-3 py-2 text-center text-xs sm:text-sm font-black uppercase text-white tracking-widest shadow-brutal-sm">
              ABHISHEK KUMAR
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
