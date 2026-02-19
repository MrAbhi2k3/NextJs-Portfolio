import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="mx-auto mt-8 max-w-5xl rounded-3xl border border-border bg-card/60 p-6 shadow-sm sm:p-10">
      <div className="grid items-center gap-8 md:grid-cols-[1.4fr,1fr]">
        <div className="space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Full Stack Developer</p>
          <h1 className="text-4xl font-bold leading-tight sm:text-6xl">I build simple and useful digital products.</h1>
          <p className="max-w-xl text-base text-muted-foreground">
            Hi, I am Abhishek. I work on clean frontend interfaces, MERN stack applications,
            and practical tools that solve real user needs.
          </p>
          <a
            href="mailto:mailus@mrabhi2k3.me"
            className="inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Contact Me
          </a>
        </div>

        <div className="mx-auto">
          <Image
            src="https://i.postimg.cc/VkJVJGJC/circulardp.webp"
            alt="Abhishek"
            width={280}
            height={280}
            className="h-52 w-52 rounded-full border-4 border-primary/30 object-cover shadow-lg sm:h-64 sm:w-64"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
