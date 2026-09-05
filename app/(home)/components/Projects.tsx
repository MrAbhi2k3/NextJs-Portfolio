import Link from "next/link";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";

const projects = [
  {
    title: "Aurenz UI",
    description: "Modern, accessible, and fast UI component system crafted for developers.",
    link: "https://aurenz-ui.vercel.app",
    tag: "LIVE APP",
    tagBg: "bg-brutal-lime",
  },
  {
    title: "MusicSync",
    description: "Real-time synchronized music streaming platform and collaborative listening webapp.",
    link: "https://musicsyns.vercel.app",
    tag: "LIVE APP",
    tagBg: "bg-brutal-cyan",
  },
  {
    title: "MovieSync",
    description: "Interactive real-time movie room platform for synchronized group streaming.",
    link: "https://github.com/MrAbhi2k3/MovieSync",
    tag: "GITHUB REPO",
    tagBg: "bg-brutal-yellow",
  },
  {
    title: "SaavnAPI",
    description: "High-performance API wrapper for JioSaavn to search, extract and stream songs, albums, and playlists.",
    link: "https://github.com/MrAbhi2k3/SaavnAPI",
    tag: "API SERVICE",
    tagBg: "bg-brutal-orange",
  },
  {
    title: "Recipe Sharing Community",
    description: "Full-stack MERN platform where foodies discover, rate, and publish culinary recipes.",
    link: "https://github.com/MrAbhi2k3/RecipeSharingCommunity",
    tag: "MERN STACK",
    tagBg: "bg-brutal-pink",
  },
  {
    title: "Telegram Filestore Bot",
    description: "Asynchronous Python bot with MongoDB integration for persistent file storage & link generation.",
    link: "https://github.com/MrAbhi2k3/TG-FileStore",
    tag: "PYTHON BOT",
    tagBg: "bg-brutal-cyan",
  },
  {
    title: "DeepSeek Clone",
    description: "Modern responsive chat interface replicating AI model interactions and completions.",
    link: "https://github.com/MrAbhi2k3/DeepSeek-Clone",
    tag: "AI WEBAPP",
    tagBg: "bg-brutal-lime",
  },
  {
    title: "Terabox Extractor",
    description: "Automated utility and Python script to bypass direct links and extract downloadable media.",
    link: "https://github.com/MrAbhi2k3/TeraboxLinkExtractor",
    tag: "UTILITY",
    tagBg: "bg-brutal-yellow",
  },
];

const Projects = () => {
  return (
    <section className="mx-auto mt-8 sm:mt-12 mb-10 sm:mb-12 w-full max-w-5xl" id="projects">
      <div className="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-2 border-b-3 sm:border-b-4 border-foreground pb-2 sm:pb-3">
        <div>
          <span className="inline-block border-2 border-foreground bg-primary px-2 py-0.5 text-[10px] sm:text-xs font-black uppercase text-primary-foreground shadow-brutal-sm">
            PORTFOLIO
          </span>
          <h2 className="text-lg sm:text-2xl md:text-3xl font-black uppercase mt-1">
            SELECTED PROJECTS
          </h2>
        </div>
        <span className="text-[10px] sm:text-xs md:text-sm font-black uppercase opacity-70">
          [{projects.length} SHIPPED]
        </span>
      </div>

      <div className="grid gap-3.5 sm:gap-5 sm:grid-cols-2">
        {projects.map((project) => (
          <article
            key={project.title}
            className="group flex flex-col justify-between border-2 sm:border-3 border-foreground bg-card p-3.5 sm:p-5 shadow-brutal transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
                <span className={`border-2 border-foreground ${project.tagBg} px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase text-black shadow-brutal-sm`}>
                  {project.tag}
                </span>
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-black uppercase tracking-tight break-words">
                {project.title}
              </h3>
              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm font-semibold text-muted-foreground leading-relaxed break-words">
                {project.description}
              </p>
            </div>

            <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t-2 border-foreground/25 flex items-center justify-between">
              <Link
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="brutal-btn bg-foreground text-background px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-black uppercase tracking-wider gap-2 hover:bg-primary hover:text-primary-foreground"
              >
                <span>OPEN PROJECT</span>
                <FaExternalLinkAlt className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 sm:mt-8 flex justify-center">
        <Link
          href="https://github.com/MrAbhi2k3"
          target="_blank"
          rel="noopener noreferrer"
          className="brutal-btn w-full sm:w-auto bg-brutal-yellow text-black px-4 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-black uppercase tracking-wider gap-2.5 text-center"
        >
          <FaGithub className="h-4 w-4 shrink-0" />
          <span>MORE ON GITHUB @MRABHI2K3</span>
        </Link>
      </div>
    </section>
  );
};

export default Projects;
