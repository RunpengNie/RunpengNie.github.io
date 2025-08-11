import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Gallery from './pages/Gallery';

function App() {
  const location = useLocation();

  return (
    <div className="bg-backGroundColor min-h-screen flex flex-col">
      {/* Navigation bar */}
      <Navbar />

      {/* Page Contents with route transition */}
      <div className="flex-grow">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/gallery" element={<Gallery />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
