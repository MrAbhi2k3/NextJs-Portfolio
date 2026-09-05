import { FaGlobe, FaMobileAlt, FaServer, FaArrowRight, FaCommentAlt } from "react-icons/fa";

const services = [
  {
    title: "Web Development",
    tagline: "High-Performance Full Stack",
    description: "From concept to production, I build ultra-fast, responsive, and SEO-optimized web applications using modern stacks like React, Next.js, TypeScript, and Tailwind CSS with robust architectures.",
    Icon: FaGlobe,
    iconBg: "bg-brutal-cyan",
    accentHoverBorder: "hover:border-brutal-cyan",
    accentHoverText: "group-hover:text-brutal-cyan",
    accentTagColor: "text-brutal-cyan",
    btnBg: "bg-brutal-cyan hover:bg-brutal-lime",
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "MERN Stack"],
  },
  {
    title: "App Development",
    tagline: "Cross-Platform Android & iOS",
    description: "Native-grade mobile applications built from single codebases with smooth 60fps animations, offline-first data synchronization, background tasks, and clean mobile user experiences.",
    Icon: FaMobileAlt,
    iconBg: "bg-brutal-lime",
    accentHoverBorder: "hover:border-brutal-lime",
    accentHoverText: "group-hover:text-brutal-lime",
    accentTagColor: "text-brutal-lime",
    btnBg: "bg-brutal-lime hover:bg-brutal-cyan",
    technologies: ["Flutter", "Dart", "Android", "Hive / SQLite", "REST Clients"],
  },
  {
    title: "REST APIs & Services",
    tagline: "Scalable Backend & Integrations",
    description: "Architecting high-concurrency RESTful microservices, secure authentication, database query optimization, asynchronous task queues, and custom Linux image distributions for servers.",
    Icon: FaServer,
    iconBg: "bg-brutal-pink",
    accentHoverBorder: "hover:border-brutal-pink",
    accentHoverText: "group-hover:text-brutal-pink",
    accentTagColor: "text-brutal-pink",
    btnBg: "bg-brutal-pink hover:bg-brutal-cyan",
    technologies: ["Node.js", "FastAPI", "Python", "MongoDB", "Linux Images"],
  },
];

const Services = () => {
  return (
    <section className="mx-auto mt-8 sm:mt-12 mb-10 sm:mb-12 w-full max-w-7xl" id="services">
      <div className="border-3 sm:border-4 border-foreground bg-card p-4 sm:p-6 shadow-brutal mb-4">
        <p className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-muted-foreground">
          Passion led us here
        </p>
        <div className="flex flex-wrap items-center justify-between gap-2 mt-1">
          <h2 className="text-xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-foreground">
            What can I do for you
          </h2>
          <span className="text-[10px] sm:text-xs font-mono font-black uppercase border-2 border-foreground bg-primary px-2.5 py-1 text-primary-foreground shadow-brutal-sm">
            [SERVICES & SOLUTIONS]
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 sm:grid-cols-3">
        {services.map((service, index) => (
          <article
            key={service.title}
            className={`group relative flex flex-col justify-between border-3 sm:border-4 border-foreground bg-card p-5 sm:p-7 shadow-brutal transition-all duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal-lg ${service.accentHoverBorder}`}
          >
            <div>
              <div className="mb-5 flex items-center justify-between">
                <div className={`flex h-14 w-14 items-center justify-center border-3 border-foreground ${service.iconBg} text-black shadow-brutal-sm group-hover:rotate-6 transition-transform`}>
                  <service.Icon className="h-7 w-7" />
                </div>
                <span className="border-2 border-foreground bg-muted px-2 py-0.5 font-mono text-[10px] font-black uppercase text-foreground">
                  SERVICE // 0{index + 1}
                </span>
              </div>

              <h3 className={`text-lg sm:text-xl font-black uppercase tracking-tight text-foreground ${service.accentHoverText} transition-colors`}>
                {service.title}
              </h3>
              <p className={`mt-1 text-[11px] font-black uppercase tracking-wider ${service.accentTagColor}`}>
                {service.tagline}
              </p>

              <p className="mt-3 text-xs sm:text-sm font-semibold text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-foreground/20">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {service.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="border border-foreground bg-muted/60 px-2 py-0.5 text-[10px] font-mono font-bold uppercase text-foreground shadow-none"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="overflow-hidden transition-all duration-200 opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-16 group-hover:mt-2">
                <a
                  href="mailto:abhishek.kumar.idev@gmail.com"
                  className={`brutal-btn w-full ${service.btnBg} text-black py-2 px-3 text-xs font-black uppercase tracking-wider gap-2 transition shadow-brutal-sm`}
                >
                  <FaCommentAlt className="h-3 w-3" />
                  <span>Contact Me</span>
                  <FaArrowRight className="h-2.5 w-2.5" />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Services;
