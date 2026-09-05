import Image from "next/image";
import Resume from "./Resume";
import { FaEnvelope, FaBolt, FaTerminal, FaCode } from "react-icons/fa";

const HeroSection = () => {
  return (
    <section className="brutal-card mx-auto w-full bg-card p-4 sm:p-7 md:p-10 mb-10 overflow-hidden">
      <div className="grid items-center gap-8 md:grid-cols-[1.3fr,1fr]">
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

          <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Hi, my name is <span className="text-foreground font-black underline decoration-primary decoration-2">Abhishek</span>
          </p>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[3.2rem] font-black leading-[1.08] tracking-tight uppercase break-words">
            Turning ideas into{" "}
            <span className="inline-block border-2 sm:border-3 border-foreground bg-brutal-yellow px-2 py-0.5 text-black shadow-brutal-sm -rotate-1 hover:rotate-0 transition-transform">
              realities
            </span>
          </h1>

          <p className="text-xs sm:text-base font-semibold leading-relaxed text-muted-foreground break-words max-w-xl">
            I am a full stack software engineer with a passion for building performant, scalable, and user-friendly WebApps, Android Apps, custom Linux Images and resilient REST APIs. I turn complex problems into robust, production-ready solutions.
          </p>

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

        <div className="relative mx-auto flex justify-center items-center w-full max-w-[280px] sm:max-w-[320px] py-4">
          <div className="absolute -top-3 -left-3 z-20 border-2 sm:border-3 border-foreground bg-brutal-yellow px-2.5 py-1 text-xs font-black shadow-brutal-sm text-black -rotate-6">
            &lt;/&gt;
          </div>

          <div className="absolute -bottom-2 -left-2 z-20 flex h-10 w-10 items-center justify-center border-2 sm:border-3 border-foreground bg-brutal-cyan text-black shadow-brutal-sm rounded-full font-black text-sm rotate-12">
            ⚡
          </div>

          <div className="absolute -bottom-4 -right-3 z-20 border-2 border-foreground bg-brutal-lime px-2 py-0.5 text-[10px] font-black uppercase text-black shadow-brutal-sm rotate-6">
            ★ PRO
          </div>

          <div className="relative w-full aspect-[4/5] rounded-[36px] border-4 border-foreground bg-gradient-to-br from-brutal-pink via-brutal-pink/90 to-primary/40 p-2.5 shadow-brutal-lg overflow-hidden flex flex-col justify-end">
            <Image
              src="https://i.postimg.cc/VkJVJGJC/circulardp.webp"
              alt="Abhishek Kumar"
              width={340}
              height={420}
              className="w-full h-full object-cover rounded-[28px] border-2 border-foreground filter contrast-105"
              priority
            />
            <div className="absolute bottom-4 left-4 right-4 border-2 border-foreground bg-black/90 backdrop-blur-xs px-3 py-1.5 text-center text-[10px] sm:text-xs font-black uppercase text-white tracking-widest shadow-brutal-sm">
              ABHISHEK KUMAR
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
