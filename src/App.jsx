import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Gallery from './pages/Gallery';

function App() {
  return (
    <div className="bg-seaBlack min-h-screen flex flex-col">
      {/* Navigation bar */}
      <Navbar />

      {/* Page Contents */}
      <div className="flex-grow">
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />
          {/* Gallery */}
          <Route path="/gallery" element={<Gallery />} />
        </Routes>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
