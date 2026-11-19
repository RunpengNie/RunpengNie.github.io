import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
import { HiExternalLink, HiPlay } from 'react-icons/hi';
import ProgressiveImage from '../components/ProgressiveImage';
import { getImage } from '../lib/images';
import projects from '../data/projects';

const LINK_ICONS = { github: FaGithub };
// Accent-colored glow behind icons and demo videos.
const GLOW = 'bg-[radial-gradient(circle_at_center,rgb(65_105_225/0.35),transparent_70%)]';

// Icons are small and often transparent, so a plain <img> avoids the blurred placeholder showing through.
function CoverIcon({ cover, title, className = 'h-[70%] max-h-44 w-auto' }) {
  const { variants } = getImage(cover.src);
  return (
    <img
      src={variants[variants.length - 1].src}
      srcSet={variants.map((v) => `${v.src} ${v.width}w`).join(', ')}
      sizes="176px"
      alt={title}
      decoding="async"
      draggable={false}
      className={`select-none ${className}`}
    />
  );
}

// Demo clip with sound, shown in place of the cover. Browsers don't autoplay video with sound, so the
// cover shows first with a "Play demo" button; the clip plays from the start when clicked, pauses while
// scrolled off screen (resuming when back) and returns to the cover when it ends. The clip stays mounted,
// just hidden, so the card keeps its size.
function ProjectDemo({ video, cover, title }) {
  const videoRef = useRef(null);
  const buttonRef = useRef(null);
  const [showCover, setShowCover] = useState(true);
  // Element to focus once the cover/clip swap has rendered, so keyboard focus never sits on a hidden element.
  const focusAfterSwap = useRef(null);

  useEffect(() => {
    focusAfterSwap.current?.focus();
    focusAfterSwap.current = null;
  }, [showCover]);

  useEffect(() => {
    const el = videoRef.current;
    let pausedByScroll = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (pausedByScroll && el.paused) el.play().catch(() => {});
          pausedByScroll = false;
        } else if (!el.paused) {
          pausedByScroll = true;
          el.pause();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const playDemo = () => {
    const el = videoRef.current;
    if (document.activeElement === buttonRef.current) focusAfterSwap.current = el;
    setShowCover(false);
    el.currentTime = 0;
    el.play().catch(() => setShowCover(true));
  };

  const onEnded = () => {
    if (document.activeElement === videoRef.current) focusAfterSwap.current = buttonRef.current;
    setShowCover(true);
  };

  return (
    <>
      <video
        ref={videoRef}
        src={video.src}
        poster={video.poster}
        width={video.width}
        height={video.height}
        aria-label={`${title} demo`}
        playsInline
        controls
        preload="none"
        onEnded={onEnded}
        className={`h-[calc(60*var(--svh))] max-h-[36rem] w-auto max-w-full rounded-xl bg-black shadow-lg shadow-black/40 ${
          showCover ? 'invisible' : ''
        }`}
        style={{ aspectRatio: `${video.width} / ${video.height}` }}
      />
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center gap-6 transition-[opacity,visibility] duration-300 ${
          showCover ? '' : 'invisible opacity-0'
        }`}
      >
        {cover.fit === 'cover' ? (
          <ProgressiveImage src={cover.src} alt={title} fit="cover" className="absolute inset-0 h-full w-full" />
        ) : (
          <CoverIcon cover={cover} title={title} className="h-auto w-32 sm:w-40 md:w-44" />
        )}
        <button
          ref={buttonRef}
          type="button"
          onClick={playDemo}
          className="relative inline-flex min-h-11 items-center gap-2 rounded-full bg-accentColor px-5 text-sm font-semibold text-white shadow-lg shadow-black/30 transition hover:opacity-85 active:scale-95"
        >
          <HiPlay aria-hidden="true" className="text-xl" />
          Play demo
        </button>
      </div>
    </>
  );
}

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
  return (
    <div className={`absolute inset-0 flex items-center justify-center ${GLOW}`}>
      <CoverIcon cover={cover} title={title} />
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
      {project.video ? (
        <div className={`relative flex flex-none items-center justify-center bg-black/30 p-6 md:w-2/5 ${GLOW}`}>
          <ProjectDemo video={project.video} cover={project.cover} title={project.title} />
        </div>
      ) : (
        <div className="relative aspect-video flex-none bg-black/30 md:aspect-auto md:w-2/5">
          <ProjectCover cover={project.cover} title={project.title} />
        </div>
      )}

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

        {project.notice && (
          <div className="rounded-lg border border-white/10 bg-black/20 p-4">
            <h3 className="text-sm font-semibold text-white">{project.notice.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-gray-400">{project.notice.text}</p>
            {project.notice.steps && (
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-gray-300 marker:text-gray-500">
                {project.notice.steps.map((step) => (
                  <li key={step}>
                    <InlineCode text={step} />
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}

        {project.credits && <p className="text-xs italic text-gray-500">{project.credits}</p>}

        {project.links.length > 0 && (
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
        )}
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
