import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ScrollIndicator from "../ScrollIndicator";

export default function ParallaxSaleSection() {
  // refs to track section and images for animation
  const sectionRef = useRef(null);
  const leftImgRef = useRef(null);
  const rightImgRef = useRef(null);

  useEffect(() => {
    /*
      EASING FUNCTION
      Makes animation smooth & premium (slow start → fast → slow end)
      You can tweak later if needed
    */
    const easeInOut = (t) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    const handleScroll = () => {
      const section = sectionRef.current;
      const leftImg = leftImgRef.current;
      const rightImg = rightImgRef.current;
      if (!section || !leftImg || !rightImg) return;

      // section position relative to viewport
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const sectionH = section.offsetHeight;

      /*
        NORMALIZED SCROLL PROGRESS (0 → 1)
        0 = section just started
        1 = section finished
      */
      const rawProgress = (vh - rect.top) / (sectionH + vh);
      const progress = Math.max(0, Math.min(1, rawProgress));

      /*
        🔥 SCROLL TIMELINE CONTROL
        Change these numbers to control WHEN images appear/disappear
      */

      const leftStart = 0.10; // left image appears
      const leftEnd = 0.95; // left image disappears

      const rightStart = 0.45; // right image appears
      const rightEnd = 0.8; // right image disappears

      /*
        MOTION SETTINGS
        Change these values to control animation feel
      */
      const travelY = sectionH * 0.7; // vertical travel distance
      const travelX = 40; // zigzag horizontal movement
      const rotateDeg = 18; // tilt rotation amount

      // ---------------- LEFT IMAGE ANIMATION ----------------
      if (progress < leftStart) {
        leftImg.style.transform = `translate3d(0, ${travelY}px, 0) rotate(-${rotateDeg}deg)`;
        leftImg.style.opacity = "0";
      } else if (progress <= leftEnd) {
        const t = (progress - leftStart) / (leftEnd - leftStart);
        const e = easeInOut(t);

        leftImg.style.transform = `
          translate3d(${travelX * Math.sin(e * Math.PI)}px, ${travelY * (1 - 2 * e)}px, 0)
          rotate(${(-rotateDeg + rotateDeg * 2 * e).toFixed(2)}deg)
        `;
        leftImg.style.opacity = "1";
      } else {
        leftImg.style.transform = `translate3d(0, -${travelY}px, 0) rotate(${rotateDeg}deg)`;
        leftImg.style.opacity = "0";
      }

      // ---------------- RIGHT IMAGE ANIMATION ----------------
      if (progress < rightStart) {
        rightImg.style.transform = `translate3d(0, ${travelY}px, 0) rotate(${rotateDeg}deg)`;
        rightImg.style.opacity = "0";
      } else if (progress <= rightEnd) {
        const t = (progress - rightStart) / (rightEnd - rightStart);
        const e = easeInOut(t);

        rightImg.style.transform = `
          translate3d(${-travelX * Math.sin(e * Math.PI)}px, ${travelY * (1 - 2 * e)}px, 0)
          rotate(${(rotateDeg - rotateDeg * 2 * e).toFixed(2)}deg)
        `;
        rightImg.style.opacity = "1";
      } else {
        rightImg.style.transform = `translate3d(0, -${travelY}px, 0) rotate(-${rotateDeg}deg)`;
        rightImg.style.opacity = "0";
      }
    };

    // attach scroll listeners
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="
  relative 
  min-h-[140vh]        /* 📱 mobile shorter */
  sm:min-h-[180vh]     /* 📱 tablet medium */
  lg:min-h-[250vh]     /* 💻 desktop full parallax */
  bg-[#f4f0eb] 
  z-10
"
    >
      {/* ================= STICKY TEXT ================= */}
      <div className="sticky top-0 h-screen flex items-center justify-center z-10">
        <div className="text-center max-w-6xl px-4">
          {/* subtitle */}
          <p className="tracking-widest uppercase text-gray-600 mb-4">
            Discover the best deal
          </p>

          {/* main heading */}
          <h1 className="text-4xl md:text-6xl xl:text-7xl font-light mb-10">
            SALE UP TO 50% <br /> FOR ALL COLLECTIONS
          </h1>

          {/* CTA button */}
          <Link to="/collections/sale">
            <button className="bg-black text-white px-8 py-3 tracking-wider">
              Check Now
            </button>
          </Link>
        </div>

        {/* ⭐ reusable scroll arrow */}
        <ScrollIndicator />
      </div>

      {/* ================= FLOATING IMAGES ================= */}
      <div className="absolute inset-0 h-screen z-20 pointer-events-none">
        {/* LEFT IMAGE */}
        <div className="absolute left-1/2 md:left-[10%] top-1/2 -translate-x-1/2 md:translate-x-0 -translate-y-1/2">
          <img
            ref={leftImgRef}
            src="https://wonder-theme-fashion.myshopify.com/cdn/shop/files/left-1.jpg?v=1708091961&width=900"
            alt="Left product"
            className="
              w-[260px] sm:w-[300px] md:w-[340px] lg:w-[420px]  /* size control */
              shadow-2xl
            "
          />
        </div>

        {/* RIGHT IMAGE */}
        <div className="absolute left-1/2 md:left-auto md:right-[10%] top-1/2 -translate-x-1/2 md:translate-x-0 -translate-y-1/2">
          <img
            ref={rightImgRef}
            src="https://wonder-theme-fashion.myshopify.com/cdn/shop/files/right-2_b486ac55-1ffe-4633-89b0-ca26c3365f91.jpg?v=1708091980&width=900"
            alt="Right product"
            className="
              w-[260px] sm:w-[300px] md:w-[340px] lg:w-[420px]
              shadow-2xl
            "
          />
        </div>
      </div>
    </section>
  );
}
