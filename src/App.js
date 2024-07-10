import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MonitoringNow from "./pages/MonitoringNow";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PeringatanDini from "./pages/PeringatanDini";
import About from "./pages/About";
import Edukasi from "./pages/Edukasi";
import Penelitian from "./pages/Penelitian";
import Peralatan from "./pages/Peralatan";

function App() {
  return (
    <div className="app scroll-smooth select-none">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/monitoring-now" element={<MonitoringNow />} />
        <Route path="/peringatan-dini" element={<PeringatanDini />} />
        <Route path="/tentang-kami" element={<About />} />
        <Route path="/edukasi" element={<Edukasi />} />
        <Route path="/penelitian" element={<Penelitian />} />
        <Route path="/peralatan" element={<Peralatan />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
