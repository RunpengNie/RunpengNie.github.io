import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 新版点击导航项函数
  const handleNavClick = (id) => {
    if (location.pathname === '/') {
      // 在首页，直接滚动
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
      setIsOpen(false);
    } else {
      // 不在首页，先跳转首页并传递要滚动的目标id
      navigate('/', { state: { scrollToId: id } });
      setIsOpen(false);
    }
  };

  return (
    <nav
      className={`
        fixed top-0 w-full z-50 transition-colors duration-300
        ${isScrolled ? 'bg-myOrange text-white shadow-md' : 'bg-transparent text-white'}
      `}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Name */}
          <button
            onClick={() => handleNavClick('home')}
            className="text-myOrange text-xl font-bold hover:opacity-80"
          >
            Jerry Nie
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <button
              onClick={() => handleNavClick('home')}
              className="hover:text-black transition"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="hover:text-black transition"
            >
              About
            </button>
            <a href="/gallery" className="hover:text-black transition">
              Gallery
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-black focus:outline-none"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div
          className={`md:hidden px-4 pb-4 space-y-2 ${
            isScrolled ? 'bg-myOrange' : 'bg-seaBlack'
          }`}
        >
          <button
            onClick={() => handleNavClick('home')}
            className="block hover:text-black"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className="block hover:text-black"
          >
            About
          </button>
          <a href="/gallery" className="block hover:text-black">
            Gallery
          </a>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
