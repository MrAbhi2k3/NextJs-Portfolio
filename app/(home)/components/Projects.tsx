import Link from "next/link";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";

const projects = [
  {
    title: "Canva Blogs",
    description: "Platform for Canva templates and premium invites.",
    link: "https://github.com/MrAbhi2k3/Canva-Premium-Invites",
  },
  {
    title: "Recipe Sharing Community",
    description: "MERN app where users share and discover recipes.",
    link: "https://github.com/MrAbhi2k3/RecipeSharingCommunity",
  },
  {
    title: "Telegram Filestore Bot",
    description: "Python bot for storing and sharing files.",
    link: "https://github.com/MrAbhi2k3/TG-FileStore",
  },
  {
    title: "Music WebApp",
    description: "Music platform with playlist support.",
    link: "https://github.com/MrAbhi2k3/Music-webApp",
  },
];

const Projects = () => {
  return (
    <section className="mx-auto mt-12 max-w-5xl" id="projects">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-primary">Projects</p>
        <h2 className="text-3xl font-bold sm:text-4xl">Selected work</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <article
            key={project.title}
            className="rounded-2xl border border-border bg-card/70 p-5 shadow-sm"
          >
            <h3 className="text-xl font-bold">{project.title}</h3>
            <p className="mt-2 text-base text-muted-foreground">{project.description}</p>
            <Link
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:opacity-80"
            >
              View Project
              <FaExternalLinkAlt className="h-3.5 w-3.5" />
            </Link>
          </article>
        ))}
      </div>

      <Link
        href="https://github.com/MrAbhi2k3"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold transition hover:bg-secondary"
      >
        <FaGithub className="h-4 w-4" />
        More on GitHub
      </Link>
    </section>
  );
};

export default Projects;
