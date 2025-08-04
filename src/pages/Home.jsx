import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.scrollToId) {
      const id = location.state.scrollToId;
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location.state]);

  return (
    <>
      {/* Hero Section */}
      <section
        id="home"
        className="relative h-screen flex items-center justify-center text-center bg-cover bg-center"
        style={{
          backgroundImage: "url('/assets/backgroundPic.jpg')"
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <motion.div
          className="relative z-10 text-white px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-myOrange">
            Runpeng "Jerry" Nie
          </h1>
          <h4 className="text-lg md:text-2xl mb-2">
            Software | Travel | Photography
          </h4>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="max-w-6xl mx-auto px-4 py-16">
        <motion.h3
          className="text-myOrange text-3xl font-bold text-center mb-12"
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
            className="w-48 h-48 object-cover rounded-full border-4 border-myOrange shadow-lg"
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
              retracting offers, and moving across states. I have also helped many friends land positions at various tech
              companies. I earned my Master’s from the University of Illinois at Urbana-Champaign because it’s{' '}
              <del className="text-gray-400">cheap</del> affordable
              {' '}and has high CS rankings. My bachelor's degree is from the University of Minnesota Twin Cities,
              mainly because it’s <del className="text-gray-400">cheap</del> affordable
              {' '}too, and my favorite basketball player was on the Minnesota Timberwolves, constantly having conflicts
              with every one of his teammates at the time.
            </p>
            <p>
              Apart from that, I love sports, especially basketball. Before I retired due to back and knee injuries,
              I was part of the Shandong Gold Lions youth training program. I also enjoy traveling and photography,
              though I’m not exactly photogenic—so you won’t find me in any of my photos. I love food and cooking,
              but I absolutely hate washing dishes. And I’m a big fan of sleep (I love my bed),
              even though I’m constantly staying up too late.
            </p>
          </motion.div>
        </div>

        {/* Special Note */}
        <motion.div
          className="max-w-3xl mx-auto mt-8 mb-12 px-6 py-4 bg-myOrange/10 border-l-4 border-myOrange rounded-md text-center italic text-white text-lg shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Oh, and by the way, I’m open to any opportunities — so if you want to hire me and you’re offering sponsorship, feel free to contact me.
        </motion.div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-seaBlack py-16">
        <motion.h3
          className="text-myOrange text-3xl font-bold text-center mb-8"
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
            className="text-gray-400 hover:text-myOrange transition transform hover:scale-110"
          >
            <FaLinkedin size={48} />
          </a>
          <a
            href="https://github.com/RunpengNie"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-myOrange transition transform hover:scale-110"
          >
            <FaGithub size={48} />
          </a>
        </div>
      </section>
    </>
  );
}

export default Home;
