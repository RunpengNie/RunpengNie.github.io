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
        // 等待页面渲染后滚动
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location.state]);

  return (
    <>
      {/* Hero Section / Profile Picture */}
      <section
        id="home"
        className="relative h-screen flex items-center justify-center text-center bg-cover bg-center"
        style={{
          backgroundImage: "url('/assets/backgroundPic.jpg')"
        }}
      >
        {/* 半透明遮罩层 */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* 内容 */}
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
            Software Engineer | Traveler | Photographer
          </h4>
          <h4 className="text-sm md:text-lg opacity-80">
            Capturing the world, one photo at a time
          </h4>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="max-w-6xl mx-auto px-4 py-16">
        {/* title */}
        <motion.h3
          className="text-myOrange text-3xl font-bold text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          About Me
        </motion.h3>

        {/* profile pic + text intro */}
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
            <h1 className="text-2xl font-bold mb-4">Let me introduce myself.</h1>
            <p className="mb-4">
              I'm a graduate of the University of Illinois at Urbana-Champaign, 
              with a strong passion for software engineering, data analysis, and photography. 
              I love exploring the world, capturing its beauty through my lens, 
              and creating meaningful digital experiences through code.
            </p>
            <p>
              My interests span across software development, web design, 
              artificial intelligence, and creative storytelling. 
              When I'm not coding, you can find me traveling, taking photos, 
              or discovering new coffee shops around the city.
            </p>
          </motion.div>
        </div>
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
            href="https://www.linkedin.com/in/runpengnie"
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
