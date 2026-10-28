import React, { useLayoutEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import { scrollToTopInstantly } from './lib/motion';

function App() {
  const location = useLocation();
  const [navSolid, setNavSolid] = useState(false);

  // Start each page at the top. Home's own "scroll to section" logic runs after this.
  useLayoutEffect(() => {
    scrollToTopInstantly();
  }, [location.pathname]);

  return (
    // reducedMotion="user": skip transform/layout animations when the OS asks for reduced motion.
    <MotionConfig reducedMotion="user">
      <div className="bg-backGroundColor min-h-screen flex flex-col">
        {/* Navigation bar */}
        <Navbar solid={navSolid} />

        {/* Page contents. The new page mounts immediately and fades in with a CSS animation,
            so it can never get stuck waiting for the previous page's exit animation. */}
        <div className="flex-grow">
          <div key={location.pathname} className="page-enter">
            <Routes location={location}>
              <Route path="/" element={<Home onHeroPassedChange={setNavSolid} />} />
              <Route path="/gallery" element={<Gallery />} />
            </Routes>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </MotionConfig>
  );
}

export default App;
