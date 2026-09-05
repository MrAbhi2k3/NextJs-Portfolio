import { FaGraduationCap, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

const educationHistory = [
  {
    degree: "Bachelor of Technology: Computer Science",
    institution: "Swami Vivekananda Institute of Engineering & Technology",
    duration: "09/2022 – 2026",
    location: "Chandigarh, Punjab",
    tag: "UNDERGRADUATION",
    accent: "border-l-8 border-l-brutal-cyan",
    badgeBg: "bg-brutal-cyan",
    status: "Completed",
  },
  {
    degree: "Intermediate of Science (10+2)",
    institution: "Barhi Inter College",
    duration: "2019 – 2021",
    location: "Hazaribagh, Jharkhand",
    tag: "SENIOR SECONDARY",
    accent: "border-l-8 border-l-brutal-yellow",
    badgeBg: "bg-brutal-yellow",
    status: "Completed",
  },
  {
    degree: "Matriculation (10th Standard)",
    institution: "Divine Public School",
    duration: "2019",
    location: "Hazaribagh, Jharkhand",
    tag: "SECONDARY EDUCATION",
    accent: "border-l-8 border-l-brutal-lime",
    badgeBg: "bg-brutal-lime",
    status: "Completed",
  },
];

const Education = () => {
  return (
    <section className="mx-auto mt-8 sm:mt-12 mb-10 sm:mb-12 w-full max-w-7xl" id="education">
      <div className="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-2 border-b-3 sm:border-b-4 border-foreground pb-2 sm:pb-3">
        <div>
          <span className="inline-block border-2 border-foreground bg-primary px-2 py-0.5 text-[10px] sm:text-xs font-black uppercase text-primary-foreground shadow-brutal-sm">
            ACADEMICS
          </span>
          <h2 className="text-lg sm:text-2xl md:text-3xl font-black uppercase mt-1">
            EDUCATION TIMELINE
          </h2>
        </div>
        <span className="text-[10px] sm:text-xs md:text-sm font-black uppercase opacity-70">
          [ACADEMIC PATHWAY]
        </span>
      </div>

      <div className="space-y-4">
        {educationHistory.map((edu) => (
          <article
            key={edu.degree}
            className={`border-3 sm:border-4 border-foreground bg-card p-4 sm:p-5 shadow-brutal transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg ${edu.accent}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className={`border-2 border-foreground ${edu.badgeBg} px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase text-black shadow-brutal-sm`}>
                    {edu.tag}
                  </span>
                  <span className="border border-foreground bg-muted px-2 py-0.5 text-[9px] font-mono font-bold uppercase text-foreground">
                    {edu.status}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black uppercase tracking-tight flex items-center gap-2 text-foreground">
                  <FaGraduationCap className="h-4 w-4 text-primary shrink-0" />
                  <span>{edu.degree}</span>
                </h3>
                <p className="mt-1 text-xs sm:text-sm font-bold text-muted-foreground">
                  {edu.institution}
                </p>
              </div>

              <div className="sm:text-right shrink-0 border-t sm:border-t-0 border-foreground/20 pt-2 sm:pt-0">
                <p className="inline-flex sm:flex items-center sm:justify-end gap-1.5 text-xs font-black text-foreground">
                  <FaCalendarAlt className="h-3 w-3 text-primary" />
                  <span>{edu.duration}</span>
                </p>
                <p className="flex items-center sm:justify-end gap-1.5 text-[11px] font-semibold text-muted-foreground mt-0.5">
                  <FaMapMarkerAlt className="h-3 w-3 text-muted-foreground" />
                  <span>{edu.location}</span>
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Education;
