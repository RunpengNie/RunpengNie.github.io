import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
import { HiExternalLink } from 'react-icons/hi';
import ProgressiveImage from '../components/ProgressiveImage';
import { getImage } from '../lib/images';
import projects from '../data/projects';

const LINK_ICONS = { github: FaGithub };

// Renders `backtick` spans as inline code; long paths may wrap mid-word when they don't fit.
function InlineCode({ text }) {
  return text.split('`').map((part, i) =>
    i % 2 === 1 ? (
      <code key={i} className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-gray-100 [overflow-wrap:anywhere]">
        {part}
      </code>
    ) : (
      part
    )
  );
}

function ProjectCover({ cover, title }) {
  if (cover.fit === 'cover') {
    return <ProgressiveImage src={cover.src} alt={title} fit="cover" className="absolute inset-0 h-full w-full" />;
  }
  // Icons are small and often transparent, so a plain <img> avoids the blurred placeholder showing through.
  const { variants } = getImage(cover.src);
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_center,rgb(65_105_225/0.35),transparent_70%)]">
      <img
        src={variants[variants.length - 1].src}
        srcSet={variants.map((v) => `${v.src} ${v.width}w`).join(', ')}
        sizes="176px"
        alt={title}
        decoding="async"
        draggable={false}
        className="h-[70%] max-h-44 w-auto select-none"
      />
    </div>
  );
}

function ProjectCard({ project }) {
  return (
    <motion.article
      className="overflow-hidden rounded-xl border border-white/10 bg-white/5 md:flex"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="relative aspect-video flex-none bg-black/30 md:aspect-auto md:w-2/5">
        <ProjectCover cover={project.cover} title={project.title} />
      </div>

      <div className="flex flex-col gap-4 p-6 md:p-8">
        <div>
          <p className="text-sm text-gray-400">{project.type}</p>
          <h2 className="mt-1 text-2xl font-bold text-white">{project.title}</h2>
        </div>

        <p className="leading-relaxed text-gray-200">{project.summary}</p>

        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-gray-300 marker:text-accentColor">
          {project.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <ul className="flex flex-wrap gap-2" aria-label="Technologies">
          {project.tech.map((tech) => (
            <li key={tech} className="rounded-full bg-accentColor/15 px-3 py-1 text-xs font-medium text-blue-200">
              {tech}
            </li>
          ))}
        </ul>

        {project.install && (
          <div className="rounded-lg border border-white/10 bg-black/20 p-4">
            <h3 className="text-sm font-semibold text-white">How to install</h3>
            <p className="mt-1 text-sm text-gray-400">{project.install.note}</p>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-gray-300 marker:text-gray-500">
              {project.install.steps.map((step) => (
                <li key={step}>
                  <InlineCode text={step} />
                </li>
              ))}
            </ol>
          </div>
        )}

        {project.credits && <p className="text-xs italic text-gray-500">{project.credits}</p>}

        <div className="mt-auto flex flex-wrap gap-3 pt-2">
          {project.links.map(({ label, href, icon }) => {
            const Icon = LINK_ICONS[icon] ?? HiExternalLink;
            return (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-sm font-semibold text-white transition hover:border-accentColor hover:bg-accentColor active:bg-accentColor"
              >
                <Icon aria-hidden="true" className="text-lg" />
                {label}
              </a>
            );
          })}
        </div>
      </div>
    </motion.article>
  );
}

function Projects() {
  return (
    <section className="max-w-6xl mx-auto px-4 pt-20 pb-16 md:pt-24">
      <h1 className="text-accentColor text-3xl font-bold text-center">Projects</h1>
      <p className="mt-3 mb-10 text-center text-gray-400">Things I have built, mostly for fun.</p>

      <div className="flex flex-col gap-8">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}

export default Projects;
