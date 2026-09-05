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

const skills = [
  { text: "MongoDB Atlas", Icon: SiMongodb, bg: "bg-brutal-lime" },
  { text: "JAVA", Icon: FaJava, bg: "bg-brutal-orange" },
  { text: "JavaScript (ES6+)", Icon: SiJavascript, bg: "bg-brutal-yellow" },
  { text: "TypeScript", Icon: SiTypescript, bg: "bg-brutal-cyan" },
  { text: "ReactJS", Icon: SiReact, bg: "bg-brutal-cyan" },
  { text: "Next.js", Icon: SiNextdotjs, bg: "bg-brutal-yellow" },
  { text: "MERN Stack", Icon: SiReact, bg: "bg-brutal-lime" },
  { text: "Node.js", Icon: SiNodedotjs, bg: "bg-brutal-lime" },
  { text: "Rest APIs", Icon: TbApi, bg: "bg-brutal-pink" },
  { text: "Flutter", Icon: SiFlutter, bg: "bg-brutal-cyan" },
  { text: "Dart", Icon: SiDart, bg: "bg-brutal-cyan" },
  { text: "Python", Icon: SiPython, bg: "bg-brutal-yellow" },
  { text: "Django", Icon: SiDjango, bg: "bg-brutal-lime" },
  { text: "Flask", Icon: SiFlask, bg: "bg-brutal-orange" },
  { text: "FastAPI", Icon: SiFastapi, bg: "bg-brutal-lime" },
  { text: "C/C++", Icon: SiCplusplus, bg: "bg-brutal-cyan" },
  { text: "Golang", Icon: SiGo, bg: "bg-brutal-cyan" },
  { text: "MySQL", Icon: SiMysql, bg: "bg-brutal-orange" },
  { text: "SQLite", Icon: SiSqlite, bg: "bg-brutal-yellow" },
  { text: "Cloud Oracle", Icon: FaDatabase, bg: "bg-brutal-pink" },
  { text: "Redis", Icon: SiRedis, bg: "bg-brutal-pink" },
  { text: "Supabase", Icon: SiSupabase, bg: "bg-brutal-lime" },
  { text: "Firebase", Icon: RiFirebaseFill, bg: "bg-brutal-yellow" },
  { text: "Docker", Icon: SiDocker, bg: "bg-brutal-cyan" },
  { text: "AWS", Icon: FaAws, bg: "bg-brutal-orange" },
  { text: "Git Bash", Icon: FaTerminal, bg: "bg-brutal-yellow" },
  { text: "Linux", Icon: SiLinux, bg: "bg-brutal-yellow" },
  { text: "Selenium", Icon: SiSelenium, bg: "bg-brutal-lime" },
  { text: "Puppeteer", Icon: SiPuppeteer, bg: "bg-brutal-cyan" },
];

const Skills = () => {
  return (
    <section className="mx-auto mt-8 sm:mt-12 mb-10 sm:mb-12 w-full max-w-5xl" id="skills">
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
          [{skills.length} TECHNOLOGIES]
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3.5">
        {skills.map(({ text, Icon, bg }) => (
          <article
            key={text}
            className="group relative border-2 sm:border-3 border-foreground bg-card p-2.5 sm:p-3 shadow-brutal transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg active:translate-x-0 active:translate-y-0 flex items-center gap-2 sm:gap-2.5"
          >
            <div className={`shrink-0 inline-flex border-2 border-foreground ${bg} p-1.5 sm:p-2 text-black shadow-brutal-sm group-hover:rotate-6 transition-transform`}>
              <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <p className="text-[11px] sm:text-xs font-black uppercase tracking-tight break-words leading-tight">
              {text}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Skills;
