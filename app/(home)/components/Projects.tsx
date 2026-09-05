import Link from "next/link";
import { FaExternalLinkAlt, FaGithub, FaStar } from "react-icons/fa";

const projects = [
  {
    title: "Aurenza UI",
    description: "Modern, highly accessible, and modular design system & UI component library engineered for high-performance React and Next.js web applications.",
    link: "https://aurenz-ui.vercel.app",
    tag: "FEATURED FLAGSHIP",
    tagBg: "bg-brutal-lime",
    stack: ["React", "TypeScript", "Tailwind CSS", "Storybook"],
    featured: true,
  },
  {
    title: "MusicSync",
    description: "Cross-platform synchronized music streaming and collaborative listening experience with real-time room syncing.",
    link: "https://musicsyns.vercel.app",
    tag: "LIVE STREAMING",
    tagBg: "bg-brutal-cyan",
    stack: ["Flutter", "Dart", "Python REST API", "WebSockets"],
    featured: true,
  },
  {
    title: "MovieSync",
    description: "Synchronized group movie room platform enabling users to stream and chat simultaneously in real time.",
    link: "https://github.com/MrAbhi2k3/MovieSync",
    tag: "GITHUB REPO",
    tagBg: "bg-brutal-yellow",
    stack: ["React", "Node.js", "Socket.io"],
    featured: false,
  },
  {
    title: "SaavnAPI",
    description: "High-throughput API wrapper for JioSaavn to search, extract metadata, and stream audio tracks, albums, and playlists.",
    link: "https://github.com/MrAbhi2k3/SaavnAPI",
    tag: "API SERVICE",
    tagBg: "bg-brutal-orange",
    stack: ["FastAPI", "Python", "Redis Cache"],
    featured: false,
  },
  {
    title: "Recipe Sharing Community",
    description: "Full-stack MERN platform where culinary enthusiasts discover, review, save, and publish food recipes.",
    link: "https://github.com/MrAbhi2k3/RecipeSharingCommunity",
    tag: "MERN STACK",
    tagBg: "bg-brutal-pink",
    stack: ["MongoDB", "Express", "React", "Node.js"],
    featured: false,
  },
  {
    title: "Telegram Filestore Bot",
    description: "Asynchronous Python bot with MongoDB integration for persistent file archiving and instant sharing link generation.",
    link: "https://github.com/MrAbhi2k3/TG-FileStore",
    tag: "PYTHON BOT",
    tagBg: "bg-brutal-cyan",
    stack: ["Pyrogram", "Python", "MongoDB"],
    featured: false,
  },
  {
    title: "DeepSeek Clone",
    description: "Modern responsive web interface replicating AI model interactions, streaming chat responses, and prompt sessions.",
    link: "https://github.com/MrAbhi2k3/DeepSeek-Clone",
    tag: "AI WEBAPP",
    tagBg: "bg-brutal-lime",
    stack: ["Next.js", "Tailwind", "AI SDK"],
    featured: false,
  },
  {
    title: "Terabox Extractor",
    description: "Automated media bypass utility and script to parse Terabox URLs and generate direct download endpoints.",
    link: "https://github.com/MrAbhi2k3/TeraboxLinkExtractor",
    tag: "AUTOMATION",
    tagBg: "bg-brutal-yellow",
    stack: ["Python", "Web Scraping", "FastAPI"],
    featured: false,
  },
];

const Projects = () => {
  return (
    <section className="mx-auto mt-8 sm:mt-12 mb-10 sm:mb-12 w-full max-w-7xl" id="projects">
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

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <article
            key={project.title}
            className={`group flex flex-col justify-between border-3 sm:border-4 border-foreground bg-card p-4 sm:p-6 shadow-brutal transition-all duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal-lg ${
              project.featured ? "md:col-span-1 border-primary/90" : ""
            }`}
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className={`inline-flex items-center gap-1 border-2 border-foreground ${project.tagBg} px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase text-black shadow-brutal-sm`}>
                  {project.featured && <FaStar className="h-2.5 w-2.5 text-black" />}
                  <span>{project.tag}</span>
                </span>
                <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground">
                  {"//"} {project.title.toLowerCase().replace(/\s+/g, '-')}
                </span>
              </div>

              <h3 className="text-lg sm:text-2xl font-black uppercase tracking-tight break-words group-hover:text-primary transition-colors">
                {project.title}
              </h3>

              <p className="mt-2 text-xs sm:text-sm font-semibold text-muted-foreground leading-relaxed break-words">
                {project.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="border border-foreground bg-muted px-2 py-0.5 text-[10px] font-mono font-bold uppercase text-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-foreground/30 flex items-center justify-between">
              <Link
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="brutal-btn bg-foreground text-background px-4 py-2 text-xs font-black uppercase tracking-wider gap-2 hover:bg-primary hover:text-primary-foreground"
              >
                <span>VISIT PROJECT</span>
                <FaExternalLinkAlt className="h-3 w-3" />
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
