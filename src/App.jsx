import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import { scrollToTopInstantly } from './lib/motion';

function App() {
  const location = useLocation();
  const [navSolid, setNavSolid] = useState(false);

  return (
    // reducedMotion="user": skip transform/layout animations when the OS asks for reduced motion.
    <MotionConfig reducedMotion="user">
      <div className="bg-backGroundColor min-h-screen flex flex-col">
        {/* Navigation bar */}
        <Navbar solid={navSolid} />

        {/* Page Contents with route transition */}
        <div className="flex-grow">
          {/* Start each new page at the top once the previous page has faded out. */}
          <AnimatePresence mode="wait" initial={false} onExitComplete={scrollToTopInstantly}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home onHeroPassedChange={setNavSolid} />} />
                <Route path="/gallery" element={<Gallery />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </MotionConfig>
  );
}

export default App;
