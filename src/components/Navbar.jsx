import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import { scrollBehavior } from '../lib/motion';

const NAV_HEIGHT = 64;

// Separate pages, listed after the Home / About section links.
const PAGE_LINKS = [
  { name: 'projects', to: '/projects', label: 'Projects' },
  { name: 'gallery', to: '/gallery', label: 'Gallery' },
];

// The bar is transparent only at the top of the home page; `solid` (set once the hero is scrolled past)
// switches it to frosted royal blue. Other pages always show the solid bar.
function Navbar({ solid }) {
  const [isOpen, setIsOpen] = useState(false);
  const [homeSection, setHomeSection] = useState('home');
  const navRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === '/';
  const opaque = !onHome || solid || isOpen;

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // On the home page, mark "About" as current once the About section reaches the upper 40% of the screen.
  useEffect(() => {
    const about = onHome && document.getElementById('about');
    if (!about) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setHomeSection(entry.isIntersecting || entry.boundingClientRect.top < 0 ? 'about' : 'home');
      },
      { rootMargin: '0px 0px -60% 0px' }
    );
    observer.observe(about);
    return () => observer.disconnect();
  }, [onHome]);

  const current = onHome ? homeSection : PAGE_LINKS.find(({ to }) => to === location.pathname)?.name ?? null;

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

  // Desktop links: a white underline grows in on hover and stays on the current item
  // (white rather than accent, since the solid bar itself is the accent color).
  const linkClass = (name) =>
    `relative inline-flex min-h-11 items-center px-2 transition-colors hover:text-white
     after:absolute after:inset-x-2 after:bottom-2 after:h-0.5 after:origin-left after:rounded-full after:bg-white after:transition-transform after:duration-300
     ${current === name ? 'text-white after:scale-x-100' : 'text-white/80 after:scale-x-0 hover:after:scale-x-100'}`;
  const mobileLinkClass = (name) =>
    `block w-full min-h-11 py-3 pl-3 text-left text-base border-l-2 transition active:scale-[0.98] hover:text-white active:text-white ${
      current === name ? 'border-white text-white' : 'border-transparent text-white/75'
    }`;

  return (
    <nav
      ref={navRef}
      className={`
        fixed top-0 w-full z-40 text-white transition-[background-color,box-shadow,border-color] duration-300 border-b
        ${opaque ? 'bg-accentColor/75 backdrop-blur-md border-white/15 shadow-lg shadow-black/20' : 'bg-transparent border-transparent'}
      `}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Name */}
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            // Shown together with the bar background; over the hero the big title already shows the name.
            // `invisible` also removes it from the tab order and accessibility tree while hidden.
            className={`min-h-11 text-lg sm:text-xl font-bold tracking-wide transition-[opacity,visibility] duration-300 hover:opacity-80 active:opacity-80 ${
              opaque ? '' : 'invisible opacity-0'
            }`}
          >
            Jerry Nie
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4">
            <button type="button" onClick={() => handleNavClick('home')} className={linkClass('home')}>
              Home
            </button>
            <button type="button" onClick={() => handleNavClick('about')} className={linkClass('about')}>
              About
            </button>
            {PAGE_LINKS.map(({ name, to, label }) => (
              <Link key={name} to={to} className={linkClass(name)} aria-current={current === name ? 'page' : undefined}>
                {label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            className="md:hidden -mr-2 flex h-11 w-11 items-center justify-center text-2xl text-white transition hover:text-white/70 active:scale-90"
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
          // Fade/slide instead of animating height: measuring height "auto" makes framer-motion
          // restore the scroll position, which cancels the smooth scroll started by a menu item.
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-4 pb-3 space-y-1">
              <button type="button" onClick={() => handleNavClick('home')} className={mobileLinkClass('home')}>
                Home
              </button>
              <button type="button" onClick={() => handleNavClick('about')} className={mobileLinkClass('about')}>
                About
              </button>
              {PAGE_LINKS.map(({ name, to, label }) => (
                <Link
                  key={name}
                  to={to}
                  onClick={() => setIsOpen(false)}
                  className={mobileLinkClass(name)}
                  aria-current={current === name ? 'page' : undefined}
                >
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
