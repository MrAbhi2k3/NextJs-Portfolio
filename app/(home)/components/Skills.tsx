import {
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiPython,
  SiReact,
  SiSupabase,
  SiTypescript,
  SiJavascript,
  SiNodedotjs,
  SiFlutter,
  SiDart,
  SiDjango,
  SiFlask,
  SiFastapi,
  SiCplusplus,
  SiGo,
  SiSqlite,
  SiRedis,
  SiDocker,
  SiSelenium,
  SiPuppeteer,
  SiLinux,
} from "react-icons/si";
import { RiFirebaseFill } from "react-icons/ri";
import { FaJava, FaAws, FaTerminal, FaDatabase } from "react-icons/fa";
import { TbApi } from "react-icons/tb";

const skillCategories = [
  {
    category: "Languages & Core",
    badge: "bg-brutal-yellow",
    items: [
      { text: "JAVA", Icon: FaJava, bg: "bg-brutal-orange" },
      { text: "JavaScript (ES6+)", Icon: SiJavascript, bg: "bg-brutal-yellow" },
      { text: "TypeScript", Icon: SiTypescript, bg: "bg-brutal-cyan" },
      { text: "Python", Icon: SiPython, bg: "bg-brutal-lime" },
      { text: "Dart", Icon: SiDart, bg: "bg-brutal-cyan" },
      { text: "C/C++", Icon: SiCplusplus, bg: "bg-brutal-pink" },
      { text: "Golang", Icon: SiGo, bg: "bg-brutal-cyan" },
    ],
  },
  {
    category: "Frontend & Mobile",
    badge: "bg-brutal-cyan",
    items: [
      { text: "ReactJS", Icon: SiReact, bg: "bg-brutal-cyan" },
      { text: "Next.js", Icon: SiNextdotjs, bg: "bg-brutal-yellow" },
      { text: "Flutter", Icon: SiFlutter, bg: "bg-brutal-cyan" },
    ],
  },
  {
    category: "Backend & Systems",
    badge: "bg-brutal-lime",
    items: [
      { text: "MERN Stack", Icon: SiReact, bg: "bg-brutal-lime" },
      { text: "Node.js", Icon: SiNodedotjs, bg: "bg-brutal-lime" },
      { text: "Rest APIs", Icon: TbApi, bg: "bg-brutal-pink" },
      { text: "FastAPI", Icon: SiFastapi, bg: "bg-brutal-lime" },
      { text: "Django", Icon: SiDjango, bg: "bg-brutal-lime" },
      { text: "Flask", Icon: SiFlask, bg: "bg-brutal-orange" },
    ],
  },
  {
    category: "Databases & Cloud",
    badge: "bg-brutal-pink",
    items: [
      { text: "MongoDB Atlas", Icon: SiMongodb, bg: "bg-brutal-lime" },
      { text: "MySQL", Icon: SiMysql, bg: "bg-brutal-orange" },
      { text: "SQLite", Icon: SiSqlite, bg: "bg-brutal-yellow" },
      { text: "Cloud Oracle", Icon: FaDatabase, bg: "bg-brutal-pink" },
      { text: "Redis", Icon: SiRedis, bg: "bg-brutal-pink" },
      { text: "Supabase", Icon: SiSupabase, bg: "bg-brutal-lime" },
      { text: "Firebase", Icon: RiFirebaseFill, bg: "bg-brutal-yellow" },
      { text: "AWS", Icon: FaAws, bg: "bg-brutal-orange" },
    ],
  },
  {
    category: "DevOps, OS & Automation",
    badge: "bg-brutal-orange",
    items: [
      { text: "Docker", Icon: SiDocker, bg: "bg-brutal-cyan" },
      { text: "Linux", Icon: SiLinux, bg: "bg-brutal-yellow" },
      { text: "Git Bash", Icon: FaTerminal, bg: "bg-brutal-yellow" },
      { text: "Selenium", Icon: SiSelenium, bg: "bg-brutal-lime" },
      { text: "Puppeteer", Icon: SiPuppeteer, bg: "bg-brutal-cyan" },
    ],
  },
];

const Skills = () => {
  return (
    <section className="mx-auto mt-8 sm:mt-12 mb-10 sm:mb-12 w-full" id="skills">
      <div className="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-2 border-b-3 sm:border-b-4 border-foreground pb-2 sm:pb-3">
        <div>
          <span className="inline-block border-2 border-foreground bg-primary px-2 py-0.5 text-[10px] sm:text-xs font-black uppercase text-primary-foreground shadow-brutal-sm">
            CAPABILITIES
          </span>
          <h2 className="text-lg sm:text-2xl md:text-3xl font-black uppercase mt-1">
            TECH STACK & SKILLS
          </h2>
        </div>
        <span className="text-[10px] sm:text-xs md:text-sm font-black uppercase opacity-70">
          [29 WEAPONS IN 5 DOMAINS]
        </span>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {skillCategories.map((group) => (
          <div
            key={group.category}
            className="border-3 sm:border-4 border-foreground bg-card p-3 sm:p-5 shadow-brutal"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className={`border-2 border-foreground ${group.badge} px-2.5 py-0.5 text-[10px] sm:text-xs font-black uppercase text-black shadow-brutal-sm`}>
                {group.category}
              </span>
              <span className="text-[10px] font-mono font-bold text-muted-foreground">
                ({group.items.length})
              </span>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-2.5">
              {group.items.map(({ text, Icon, bg }) => (
                <div
                  key={text}
                  className="group inline-flex items-center gap-2 border-2 border-foreground bg-background px-3 py-1.5 shadow-brutal-sm transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal hover:bg-card active:translate-x-0 active:translate-y-0"
                >
                  <div className={`border border-foreground ${bg} p-1 text-black shadow-none group-hover:rotate-6 transition-transform`}>
                    <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-black uppercase tracking-tight text-foreground whitespace-nowrap">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
