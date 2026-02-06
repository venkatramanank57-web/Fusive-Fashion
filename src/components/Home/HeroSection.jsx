// =====================================
// src/components/Home/HeroSection.jsx
// =====================================

import { Link } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";

export default function HeroSection() {
  const imageRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // BRAND NAME - Add your brand name here
  const brandName = "ELYSIAN"; // ← CHANGE THIS TO YOUR BRAND

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Optimized scroll handler with useCallback
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const heroHeight = window.innerHeight * 1.6;
    const progress = Math.min(scrollY / heroHeight, 1);
    
    setScrollProgress(progress);
    
    if (imageRef.current) {
      requestAnimationFrame(() => {
        const translateY = scrollY < window.innerHeight 
          ? -scrollY * 0.5
          : -(window.innerHeight * 0.5 + (scrollY - window.innerHeight) * 1.0);
        
        imageRef.current.style.transform = `translateY(${translateY}px)`;
      });
    }
  }, []);

  // Throttled scroll listener
  useEffect(() => {
    let ticking = false;
    
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [handleScroll]);

  // Calculate opacity values
  const logoOpacity = Math.max(0, 1 - scrollProgress * 2);
  const textOpacity = Math.max(0, 1 - scrollProgress * 1.5);
  const textTranslateY = (1 - scrollProgress) * 20;
  const overlayOpacity = 0.3 + (scrollProgress * 0.7);

  return (
    <>
      <div
  className="relative w-full"
  style={{ height: "25vh" }}
  aria-label="Hero Section"
>

        
        {/* BRAND LOGO - This appears in HeroSection */}
        <div 
          className="fixed top-3.5 left-0 right-0  flex justify-center transition-opacity duration-300 pointer-events-none z-10"
          style={{ opacity: logoOpacity }}
          aria-hidden={logoOpacity < 0.1}
        >
          <div className="w-48 md:w-96 text-center">
            <h1 className="text-white text-2xl md:text-4xl font-bold tracking-wider">
              {brandName.toUpperCase()}
            </h1>
          </div>
        </div>

        {/* Fixed Background Image Container */}
        <div className="fixed top-0 left-0 w-full h-screen z-0 overflow-hidden">
          <div 
            ref={imageRef}
            className="absolute top-0 left-0 w-full h-[160vh] will-change-transform"
          >
            {/* Mobile Image */}
            <img 
              src="//wonder-theme-fashion.myshopify.com/cdn/shop/files/3-velour-mobile-banner-main.jpg?v=1763505144&width=2000"
              srcSet="//wonder-theme-fashion.myshopify.com/cdn/shop/files/3-velour-mobile-banner-main.jpg?v=1763505144&width=352 352w, //wonder-theme-fashion.myshopify.com/cdn/shop/files/3-velour-mobile-banner-main.jpg?v=1763505144&width=832 832w, //wonder-theme-fashion.myshopify.com/cdn/shop/files/3-velour-mobile-banner-main.jpg?v=1763505144&width=1200 1200w, //wonder-theme-fashion.myshopify.com/cdn/shop/files/3-velour-mobile-banner-main.jpg?v=1763505144&width=1920 1920w"
              alt="Fashion model wearing elegant dress"
              className="block md:hidden w-full h-[160vh] object-cover object-top"
              loading="eager"
              fetchPriority="high"
            />
            
            {/* Desktop Image */}
            <img 
              src="//wonder-theme-fashion.myshopify.com/cdn/shop/files/3-velour-desktop-main-banner.jpg?v=1763505103&width=2000"
              srcSet="//wonder-theme-fashion.myshopify.com/cdn/shop/files/3-velour-desktop-main-banner.jpg?v=1763505103&width=352 352w, //wonder-theme-fashion.myshopify.com/cdn/shop/files/3-velour-desktop-main-banner.jpg?v=1763505103&width=832 832w, //wonder-theme-fashion.myshopify.com/cdn/shop/files/3-velour-desktop-main-banner.jpg?v=1763505103&width=1200 1200w, //wonder-theme-fashion.myshopify.com/cdn/shop/files/3-velour-desktop-main-banner.jpg?v=1763505103&width=1920 1920w"
              alt="Fashion model wearing elegant dress"
              className="hidden md:block w-full h-[160vh] object-cover object-top"
              loading="eager"
              fetchPriority="high"
            />
            
            {/* Gradient Overlay */}
            <div 
              className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/70"
              style={{ opacity: overlayOpacity }}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Fixed Text Content */}
        <div className="fixed inset-0 z-10 flex items-end justify-center px-4 pb-16 md:pb-24">
          <div 
            className="text-center max-w-3xl mx-auto transition-all duration-500"
            style={{
              transform: `translateY(${textTranslateY}px)`,
              opacity: textOpacity
            }}
            aria-hidden={textOpacity < 0.1}
          >
            <p className="text-white text-xs md:text-sm uppercase tracking-[0.3em] mb-4 md:mb-6 font-light">
              Redefine Your Elegance
            </p>

            <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-bold mb-8 md:mb-12 leading-tight">
              Dresses you&apos;ll adore
            </h1>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/collections/dress"
                className="inline-block px-6 py-3 md:px-8 md:py-3 bg-white text-black font-medium text-sm md:text-base hover:bg-gray-50 transition-all duration-300 whitespace-nowrap rounded shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/20"
                aria-label="Shop Dresses"
              >
                Shop Dress
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Spacer Div */}
      <div 
        className="relative z-0 w-full" 
        style={{ height: '160vh' }}
        aria-hidden="true"
      />
    </>
  );
}