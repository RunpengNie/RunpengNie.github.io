import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import { scrollBehavior } from '../lib/motion';

const NAV_HEIGHT = 64;

// `solid` switches the bar from transparent to the accent color (set once the hero is scrolled past).
function Navbar({ solid }) {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Close the mobile menu when tapping outside of it or pressing Escape.
  useEffect(() => {
    if (!isOpen) return undefined;
    const onPointerDown = (e) => {
      if (!navRef.current.contains(e.target)) setIsOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  const handleNavClick = (id) => {
    setIsOpen(false);
    if (location.pathname === '/') {
      const section = document.getElementById(id);
      if (section) {
        const y = section.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
        window.scrollTo({ top: y, behavior: scrollBehavior() });
      }
    } else {
      navigate('/', { state: { scrollToId: id } });
    }
  };

  const linkClass = 'inline-flex min-h-11 items-center px-2 transition hover:text-black hover:scale-105 active:scale-95';
  const mobileLinkClass = `block w-full min-h-11 py-3 text-left text-base transition active:scale-[0.98] ${
    solid ? 'hover:text-black active:text-black' : 'hover:text-accentColor active:text-accentColor'
  }`;

  return (
    <nav
      ref={navRef}
      className={`
        fixed top-0 w-full z-40 pt-[env(safe-area-inset-top)] transition-colors duration-300
        ${solid ? 'bg-accentColor text-white shadow-md' : 'bg-transparent text-white'}
      `}
    >
      <div className="max-w-6xl mx-auto pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Name */}
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className={`
              min-h-11 text-lg sm:text-xl font-bold hover:opacity-80 transition-colors duration-300
              ${solid ? 'text-black' : 'text-transparent'}
            `}
          >
            <span className="sm:hidden">Jerry Nie</span>
            <span className="hidden sm:inline">Hi, I am Jerry, nice to meet you</span>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4">
            <button type="button" onClick={() => handleNavClick('home')} className={linkClass}>
              Home
            </button>
            <button type="button" onClick={() => handleNavClick('about')} className={linkClass}>
              About
            </button>
            <Link to="/gallery" className={linkClass}>
              Gallery
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            className="md:hidden -mr-2 flex h-11 w-11 items-center justify-center text-2xl text-white transition hover:text-black active:scale-90"
            aria-label={isOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isOpen ? 'close' : 'open'}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.15 }}
              >
                {isOpen ? <HiX /> : <HiMenu />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown with animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`md:hidden overflow-hidden shadow-lg ${
              solid ? 'bg-accentColor' : 'bg-backGroundColor'
            }`}
          >
            <div className="pb-2 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]">
              <button type="button" onClick={() => handleNavClick('home')} className={mobileLinkClass}>
                Home
              </button>
              <button type="button" onClick={() => handleNavClick('about')} className={mobileLinkClass}>
                About
              </button>
              <Link to="/gallery" onClick={() => setIsOpen(false)} className={mobileLinkClass}>
                Gallery
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
