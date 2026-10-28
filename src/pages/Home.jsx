import React, { useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import ProgressiveImage from '../components/ProgressiveImage';
import { getImage } from '../lib/images';
import { scrollBehavior } from '../lib/motion';

// onHeroPassedChange(true) once the hero subtitle has scrolled above the viewport (used for the navbar).
function Home({ onHeroPassedChange }) {
  const location = useLocation();
  const triggerRef = useRef(null);

  // Random background
  const bg = useMemo(
    () => (Math.random() < 0.5 ? '/assets/backgroundPic2.jpg' : '/assets/backgroundPic.jpg'),
    []
  );
  const bgEntry = getImage(bg);

  useEffect(() => {
    if (location.state && location.state.scrollToId) {
      const id = location.state.scrollToId;
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: scrollBehavior() });
        }, 100);
      }
    }
  }, [location.state]);

  useEffect(() => {
    if (!onHeroPassedChange) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      onHeroPassedChange(!entry.isIntersecting && entry.boundingClientRect.bottom <= 0);
    });
    observer.observe(triggerRef.current);
    return () => {
      observer.disconnect();
      onHeroPassedChange(false);
    };
  }, [onHeroPassedChange]);

  return (
    <>
      {/* Hero Section: fills the screen on mobile, keeps the photo's aspect ratio from md up */}
      <section
        id="home"
        className="relative w-full overflow-hidden h-[calc(100*var(--svh))] md:h-auto md:aspect-[var(--hero-ratio)]"
        style={{ '--hero-ratio': `${bgEntry.width} / ${bgEntry.height}` }}
      >
        <ProgressiveImage
          src={bg}
          alt="background"
          fit="cover"
          maxDpr={2}
          priority
          className="absolute inset-0 h-full w-full"
        />

        <div className="absolute inset-0 bg-black/50 pointer-events-none"></div>

        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center text-center px-4 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div>
            <h1 className="text-[clamp(1.875rem,8vw,3.75rem)] leading-tight font-bold mb-4 text-accentColor">
              Runpeng "Jerry" Nie
            </h1>
            <h4 ref={triggerRef} className="text-[clamp(1rem,4.5vw,1.5rem)] mb-2">
              Software | Travel | Photography
            </h4>
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="max-w-6xl mx-auto px-4 py-16 scroll-mt-16">
        <motion.h3
          className="text-accentColor text-3xl font-bold text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          About Me
        </motion.h3>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* profile pic */}
          <motion.img
            src="/assets/profilepic.jpg"
            alt="Profile"
            className="w-48 h-48 object-contain rounded-full border-4 border-accentColor shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          />

          {/* self intro */}
          <motion.div
            className="text-white text-lg leading-relaxed"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h1 className="text-2xl font-bold mb-4">
              Professional Stack Overflow copy-paster, part-time bug creator, and full-time ChatGPT prompter.
            </h1>
            <p className="mb-4">
              Terrible English speaker and an authentic H1B indentured servant, just waiting for the next round of
              layoffs. Thanks to the U.S. job market, I’ve gained extensive experience in handling layoffs, employers
              retracting offers, and moving across states. Because of these experiences, I have also helped many friends 
              land positions at various tech companies. I earned my Master’s from the University of Illinois at Urbana-Champaign 
              because it’s{' '} <del className="text-gray-400">cheap</del> affordable
              {' '}and has high CS rankings. My bachelor's degree is from the University of Minnesota Twin Cities,
              mainly because it’s <del className="text-gray-400">cheap</del> affordable
              {' '}too, and my favorite basketball player was on the Minnesota Timberwolves, constantly having conflicts
              with every one of his teammates at the time.
            </p>
            <p>
              Apart from that, I love sports, especially basketball. Before I retired due to back and knee injuries,
              I was part of the Shandong Gold Lions youth training program. I also enjoy traveling and photography,
              though I’m not photogenic at all—so you won’t find me in any of my photos. I love food and cooking,
              but I absolutely hate washing dishes. And I’m a big fan of sleep (I love my bed),
              even though I’m constantly staying up too late.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Special Note */}
      <motion.div
        className="max-w-3xl mx-auto mt-8 mb-12 px-6 py-4 bg-accentColor/10 border-l-4 border-accentColor rounded-md text-center italic text-white text-lg shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        Oh, and by the way, I’m open to any opportunities — so if you want to hire me and you’re offering sponsorship, feel free to contact me.
      </motion.div>

      {/* Contact Section */}
      <section id="contact" className="bg-backGroundColor py-16 scroll-mt-16">
        <motion.h3
          className="text-accentColor text-3xl font-bold text-center mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Contact Me
        </motion.h3>
        <div className="flex justify-center gap-8">
          <a
            href="https://www.linkedin.com/in/runpeng-nie/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-accentColor transition transform hover:scale-110"
          >
            <FaLinkedin size={48} />
          </a>
          <a
            href="https://github.com/RunpengNie"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-accentColor transition transform hover:scale-110"
          >
            <FaGithub size={48} />
          </a>
        </div>
      </section>
    </>
  );
}

export default Home;
