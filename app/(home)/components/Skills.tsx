import {
  SiGit,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiPython,
  SiReact,
  SiTypescript,
} from "react-icons/si";
import { RiFirebaseFill } from "react-icons/ri";

const skills = [
  { text: "React", Icon: SiReact },
  { text: "Next.js", Icon: SiNextdotjs },
  { text: "TypeScript", Icon: SiTypescript },
  { text: "Python", Icon: SiPython },
  { text: "MongoDB", Icon: SiMongodb },
  { text: "MySQL", Icon: SiMysql },
  { text: "Git", Icon: SiGit },
  { text: "Firebase", Icon: RiFirebaseFill },
];

const Skills = () => {
  return (
    <section className="mx-auto mt-12 max-w-5xl" id="skills">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-primary">Skills</p>
        <h2 className="text-3xl font-bold sm:text-4xl">Tech I use</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {skills.map(({ text, Icon }) => (
          <article
            key={text}
            className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <Icon className="h-7 w-7 text-primary" />
            <p className="mt-3 text-base font-semibold">{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Skills;
