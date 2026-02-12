// =====================================
// src/components/StickyHeader.jsx
// =====================================

import { useState, useEffect } from "react";
import AnnouncementBar from "./AnnouncementBar";
import Header from "./Header";

export default function StickyHeader() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Scroll behavior effect
  useEffect(() => {
    const controlHeader = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      } 
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }
      
      if (currentScrollY === 0) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          controlHeader();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div className={`sticky top-0 z-50 transition-transform duration-300 ease-in-out ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <AnnouncementBar />
      <Header /> {/* 👈 Header now uses search context */}
    </div>
  );
}