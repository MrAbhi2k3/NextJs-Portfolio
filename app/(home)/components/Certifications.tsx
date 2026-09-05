import { FaCertificate, FaShieldAlt, FaPython, FaDatabase } from "react-icons/fa";

const certifications = [
  {
    title: "MERN Stack Full Stack",
    issuer: "MindCode Lab",
    details: "End-to-end full stack architecture with React, Node.js, Express & MongoDB.",
    Icon: FaCertificate,
    bg: "bg-brutal-lime",
  },
  {
    title: "Certified in Cybersecurity (CC)",
    issuer: "ISC2 & LinkedIn",
    details: "Foundational security principles, incident response, network security & access control.",
    Icon: FaShieldAlt,
    bg: "bg-brutal-pink",
  },
  {
    title: "Basics with Python",
    issuer: "Udemy",
    details: "Core Python libraries, command-line tooling, data structures & scripting.",
    Icon: FaPython,
    bg: "bg-brutal-yellow",
  },
  {
    title: "Introduction to Cybersecurity",
    issuer: "Great Learning",
    details: "Network inspection, port scanning fundamentals, and security protocols.",
    Icon: FaShieldAlt,
    bg: "bg-brutal-cyan",
  },
  {
    title: "SQL for Data Analytics",
    issuer: "L&T",
    details: "Relational queries, optimization, and database integration with Python & MERN.",
    Icon: FaDatabase,
    bg: "bg-brutal-orange",
  },
];

const Certifications = () => {
  return (
    <section className="mx-auto mt-8 sm:mt-12 mb-10 sm:mb-12 w-full" id="certifications">
      <div className="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-2 border-b-3 sm:border-b-4 border-foreground pb-2 sm:pb-3">
        <div>
          <span className="inline-block border-2 border-foreground bg-primary px-2 py-0.5 text-[10px] sm:text-xs font-black uppercase text-primary-foreground shadow-brutal-sm">
            VALIDATION
          </span>
          <h2 className="text-lg sm:text-2xl md:text-3xl font-black uppercase mt-1">
            CERTIFICATIONS
          </h2>
        </div>
        <span className="text-[10px] sm:text-xs md:text-sm font-black uppercase opacity-70">
          [{certifications.length} CREDENTIALS]
        </span>
      </div>

      <div className="grid gap-3.5 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map(({ title, issuer, details, Icon, bg }) => (
          <article
            key={title}
            className="group flex flex-col justify-between border-2 sm:border-3 border-foreground bg-card p-3.5 sm:p-5 shadow-brutal transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className={`inline-flex border-2 border-foreground ${bg} p-2 text-black shadow-brutal-sm group-hover:rotate-6 transition-transform`}>
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span className="border border-foreground bg-muted px-2 py-0.5 text-[9px] font-mono font-bold uppercase text-foreground">
                  {issuer}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black uppercase tracking-tight break-words">
                {title}
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm font-semibold text-muted-foreground leading-relaxed break-words">
                {details}
              </p>
            </div>

            <div className="mt-4 pt-2 border-t border-foreground/20 flex items-center text-[10px] sm:text-xs font-black uppercase tracking-wider text-foreground">
              <span>VERIFIED CREDENTIAL ✓</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Certifications;
