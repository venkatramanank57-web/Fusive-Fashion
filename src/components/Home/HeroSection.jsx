// =====================================
// HeroSection.jsx
// Desktop → 2-Phase Parallax (NO WHITE GAP)
// Mobile → Normal Static Hero
// =====================================

import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export default function HeroSection() {
  const imageRef = useRef(null);
  const heroRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  const brandName = "ELYSIAN";

  // detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ⭐ DESKTOP PARALLAX ENGINE
  useEffect(() => {
    if (isMobile) return;

    const heroHeight = window.innerHeight;
    const imageExtraScroll = heroHeight * 0.6; // first 50vh scroll = image only

    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Phase 1 → image parallax
      const imageScroll = Math.min(scrollY, imageExtraScroll);
      if (imageRef.current) {
        imageRef.current.style.transform = `translateY(-${imageScroll}px)`;
      }

      // Phase 2 → hero moves AFTER image finished
      let heroMove = 0;
      if (scrollY > imageExtraScroll) {
        heroMove = scrollY - imageExtraScroll;
      }
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(-${heroMove}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  // ⭐ MOBILE HERO (normal section)
  if (isMobile) {
    return (
      <section className="relative h-screen w-full overflow-hidden">
        <img
          src="//wonder-theme-fashion.myshopify.com/cdn/shop/files/3-velour-mobile-banner-main.jpg?v=1763505144&width=2000"
          className="absolute inset-0 w-full h-full object-cover"
          alt=""
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/50" />

        <div className="absolute top-6 left-0 right-0 flex justify-center">
          <h1 className="text-white text-2xl font-bold tracking-wider">
            {brandName}
          </h1>
        </div>

        <div className="absolute inset-0 flex items-end justify-center pb-16 px-4">
          <div className="text-center max-w-xl">
            <p className="text-white text-xs uppercase tracking-[0.3em] mb-4">
              Redefine Your Elegance
            </p>

            <h1 className="text-white text-3xl font-bold mb-8">
              Dresses you&apos;ll adore
            </h1>

            <Link
              to="/collections/dress"
              className="px-6 py-3 bg-white text-black rounded shadow"
            >
              Shop Dress
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // ⭐ DESKTOP HERO (PARALLAX)
  return (
    <>
      <section
        ref={heroRef}
        className="fixed inset-0 h-screen w-full overflow-hidden z-10"
      >
        {/* IMAGE MUST BE TALLER THAN SCROLL SPACE */}
        <div
          ref={imageRef}
          className="absolute inset-0 w-full h-[150vh] will-change-transform"
        >
          <img
            src="//wonder-theme-fashion.myshopify.com/cdn/shop/files/3-velour-desktop-main-banner.jpg?v=1763505103&width=2000"
            className="w-full h-[150vh] object-cover object-top"
            alt=""
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/50" />
        </div>

        {/* LOGO */}
        <div className="absolute top-6 left-0 right-0 flex justify-center">
          <h1 className="text-white text-4xl font-bold tracking-wider">
            {brandName}
          </h1>
        </div>

        {/* TEXT */}
        <div className="absolute inset-0 flex items-end justify-center pb-24 px-4">
          <div className="text-center max-w-3xl">
            <p className="text-white text-sm uppercase tracking-[0.3em] mb-6">
              Redefine Your Elegance
            </p>

            <h1 className="text-white text-6xl font-bold mb-12">
              Dresses you&apos;ll adore
            </h1>

            <Link
              to="/collections/dress"
              className="px-8 py-3 bg-white text-black rounded shadow-lg"
            >
              Shop Dress
            </Link>
          </div>
        </div>
      </section>

      {/* ⭐ FAKE SCROLL SPACE (must match hero scroll distance) */}
      <div className="h-[130vh]" />
    </>
  );
}
