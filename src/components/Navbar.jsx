import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function Navbar() {
  const [isOpaque, setIsOpaque] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      const triggerEl = document.getElementById('scroll-trigger');
      if (!triggerEl) {
        setIsOpaque(false);
        return;
      }
      const rect = triggerEl.getBoundingClientRect();
      // 当该元素底部完全滑出视口顶部时，导航变不透明
      if (rect.bottom <= 0) {
        setIsOpaque(true);
      } else {
        setIsOpaque(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // 刷新时初始化判断
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id) => {
    if (location.pathname === '/') {
      const section = document.getElementById(id);
      if (section) {
        const yOffset = -64; // 根据导航高度调整
        const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
      setIsOpen(false);
    } else {
      navigate('/', { state: { scrollToId: id } });
      setIsOpen(false);
    }
  };

  return (
    <nav
      className={`
        fixed top-0 w-full z-50 transition-colors duration-300
        ${isOpaque ? 'bg-accentColor text-white shadow-md' : 'bg-transparent text-white'}
      `}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Name */}
          <button
            onClick={() => handleNavClick('home')}
            className={`
              text-xl font-bold hover:opacity-80 transition-colors duration-300
              ${isOpaque ? 'text-black' : 'text-transparent'}
            `}
          >
            Hi, I am Jerry, nice to meet you
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <button
              onClick={() => handleNavClick('home')}
              className="hover:text-black transition transform hover:scale-105"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="hover:text-black transition transform hover:scale-105"
            >
              About
            </button>
            <a
              href="/gallery"
              className="hover:text-black transition transform hover:scale-105"
            >
              Gallery
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-black focus:outline-none transition transform hover:scale-110"
              aria-label="Toggle Menu"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown with animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`md:hidden px-4 pb-4 space-y-2 ${
              isOpaque ? 'bg-accentColor' : 'bg-backGroundColor'
            } overflow-hidden`}
          >
            <button
              onClick={() => handleNavClick('home')}
              className="block hover:text-black transition transform hover:scale-105"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="block hover:text-black transition transform hover:scale-105"
            >
              About
            </button>
            <a
              href="/gallery"
              className="block hover:text-black transition transform hover:scale-105"
            >
              Gallery
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
