import { FaTrophy, FaCalendarAlt, FaStar } from "react-icons/fa";

const achievements = [
  {
    title: "Google Ideathon",
    organizer: "Google Student Developer Club (SVIET)",
    date: "07/05/2025",
    description: "Honored for innovation and high-impact project presentation in college ideathon hackathon.",
    tag: "IDEATHON IDEA",
    accent: "bg-brutal-yellow",
    shadow: "shadow-brutal",
  },
  {
    title: "BharatTech Experience",
    organizer: "SVIET, Chandigarh",
    date: "26/01/2025",
    description: "Showcased AI and MERN-powered projects at state-level technical exhibition.",
    tag: "TECH SUMMIT EXHIBIT",
    accent: "bg-brutal-cyan",
    shadow: "shadow-brutal",
  },
  {
    title: "Google Cloud Experience",
    organizer: "Google Cloud Organisation",
    date: "01/12/2022",
    description: "Completed hands-on tracks in cloud computing architectures, storage & containers.",
    tag: "CLOUD BADGE",
    accent: "bg-brutal-lime",
    shadow: "shadow-brutal",
  },
  {
    title: "GitHub Hacktoberfest",
    organizer: "GitHub Organised October",
    date: "01/12/2021",
    description: "Successfully completed open-source contributions to global developer repositories.",
    tag: "OPEN SOURCE SPRINT",
    accent: "bg-brutal-pink",
    shadow: "shadow-brutal",
  },
];

const Achievements = () => {
  return (
    <section className="mx-auto mt-8 sm:mt-12 mb-10 sm:mb-12 w-full" id="achievements">
      <div className="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-2 border-b-3 sm:border-b-4 border-foreground pb-2 sm:pb-3">
        <div>
          <span className="inline-block border-2 border-foreground bg-primary px-2 py-0.5 text-[10px] sm:text-xs font-black uppercase text-primary-foreground shadow-brutal-sm">
            HONORS
          </span>
          <h2 className="text-lg sm:text-2xl md:text-3xl font-black uppercase mt-1">
            ACHIEVEMENTS & HONORS
          </h2>
        </div>
        <span className="text-[10px] sm:text-xs md:text-sm font-black uppercase opacity-70">
          [{achievements.length} RECOGNITIONS]
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {achievements.map((item) => (
          <article
            key={item.title}
            className="relative border-3 sm:border-4 border-foreground bg-card p-4 sm:p-5 shadow-brutal transition-all duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal-lg overflow-hidden flex flex-col justify-between"
          >
            <div className={`absolute top-0 right-0 border-b-2 border-l-2 border-foreground ${item.accent} px-3 py-1 text-[9px] sm:text-[10px] font-black uppercase text-black shadow-brutal-sm`}>
              {item.tag}
            </div>

            <div className="pt-4">
              <div className="flex items-center gap-2 text-primary">
                <FaTrophy className="h-5 w-5 shrink-0" />
                <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-foreground">
                  {item.title}
                </h3>
              </div>

              <p className="mt-1 text-xs font-bold text-foreground/90 uppercase tracking-wide">
                {item.organizer}
              </p>

              <p className="mt-2 text-xs sm:text-sm font-semibold text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t-2 border-foreground/20 flex items-center justify-between">
              <span className="inline-flex items-center gap-1 font-mono text-[10px] sm:text-xs font-bold text-muted-foreground">
                <FaCalendarAlt className="h-3 w-3 text-foreground" />
                {item.date}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-primary">
                <FaStar className="h-2.5 w-2.5" />
                VERIFIED
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Achievements;
