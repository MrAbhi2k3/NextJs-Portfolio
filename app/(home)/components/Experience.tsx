import { FaBriefcase, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

const experiences = [
  {
    role: "Corporate Trainer & Full Stack Developer",
    company: "Sortiq Solutions Pvt. Ltd.",
    duration: "02/2026 – Present",
    location: "Mohali, Punjab, India",
    tag: "CURRENT ROLE",
    tagBg: "bg-brutal-lime",
    highlights: [
      "Delivered corporate training sessions on React.js, Next.js, JavaScript, HTML, CSS, Tailwind CSS, and the MERN Stack.",
      "Mentored students and junior developers through hands-on projects, coding exercises, and real-world development practices.",
      "Developed and maintained full-stack web applications using React.js, Next.js, Node.js, Express.js, and MongoDB.",
      "Built responsive, SEO-friendly user interfaces and integrated RESTful APIs with frontend applications.",
      "Collaborated with cross-functional teams to implement new features, optimize application performance, and resolve production issues.",
    ],
  },
];

const Experience = () => {
  return (
    <section className="mx-auto mt-8 sm:mt-12 mb-10 sm:mb-12 w-full max-w-7xl" id="experience">
      <div className="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-2 border-b-3 sm:border-b-4 border-foreground pb-2 sm:pb-3">
        <div>
          <span className="inline-block border-2 border-foreground bg-primary px-2 py-0.5 text-[10px] sm:text-xs font-black uppercase text-primary-foreground shadow-brutal-sm">
            CAREER
          </span>
          <h2 className="text-lg sm:text-2xl md:text-3xl font-black uppercase mt-1">
            PROFESSIONAL EXPERIENCE
          </h2>
        </div>
        <span className="text-[10px] sm:text-xs md:text-sm font-black uppercase opacity-70">
          [INDUSTRY WORK]
        </span>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {experiences.map((exp) => (
          <article
            key={exp.company}
            className="border-2 sm:border-3 border-foreground bg-card p-4 sm:p-6 shadow-brutal transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg"
          >
            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
              <div>
                <span className={`inline-block border-2 border-foreground ${exp.tagBg} px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase text-black shadow-brutal-sm mb-2`}>
                  {exp.tag}
                </span>
                <h3 className="text-base sm:text-xl font-black uppercase tracking-tight">
                  {exp.role}
                </h3>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm font-bold text-muted-foreground mt-1">
                  <span className="inline-flex items-center gap-1 text-foreground">
                    <FaBriefcase className="h-3 w-3" />
                    {exp.company}
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <FaCalendarAlt className="h-3 w-3" />
                    {exp.duration}
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <FaMapMarkerAlt className="h-3 w-3" />
                    {exp.location}
                  </span>
                </div>
              </div>
            </div>

            <ul className="mt-4 space-y-2 border-t-2 border-foreground/20 pt-3">
              {exp.highlights.map((point, index) => (
                <li key={index} className="flex items-start gap-2 text-xs sm:text-sm font-semibold text-muted-foreground leading-relaxed">
                  <span className="text-primary font-black mt-0.5">▶</span>
                  <span className="break-words">{point}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Experience;
