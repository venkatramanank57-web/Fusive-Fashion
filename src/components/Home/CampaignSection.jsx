import { useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function CampaignSection() {
  const scrollRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const items = [
    {
      title: "CASUAL DRESS BY MOE",
      desc: "Unlock the Secrets of Casual Dress",
      img: "//wonder-theme-fashion.myshopify.com/cdn/shop/files/main-column-1.jpg?v=1708418449&width=1200",
      link: "/products/elegant-dress-with-a-sash-on-the-shoulder",
    },
    {
      title: "MODERN ELEGANT",
      desc: "The new season is on the horizon",
      img: "//wonder-theme-fashion.myshopify.com/cdn/shop/files/multicolumn-ver-2.jpg?v=1726587472&width=1200",
      link: "/collections/elegant-dresses-by-nife",
    },
    {
      title: "GLAMOUR",
      desc: "It's time to refresh with closet staples",
      img: "//wonder-theme-fashion.myshopify.com/cdn/shop/files/main-column-3.jpg?v=1708418480&width=1200",
      link: "/products/a-detachable-dress-at-the-waist-with-pleats",
    },
  ];

  /* DOT CLICK */
  const scrollToSlide = (index) => {
    const container = scrollRef.current;
    if (!container) return;
    const width = container.offsetWidth;
    container.scrollTo({ left: width * index, behavior: "smooth" });
    setCurrentSlide(index);
  };

  /* SWIPE DETECTION - FIXED SYNC */
  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;
    const slideWidth = container.offsetWidth;
    // Sensitive detection
    const newSlide = Math.round(container.scrollLeft / slideWidth);
    if (newSlide !== currentSlide && newSlide < items.length) {
      setCurrentSlide(newSlide);
    }
  };

  /* MOBILE ARROWS */
  const nextSlide = () => {
    const newIndex = Math.min(currentSlide + 1, items.length - 1);
    scrollToSlide(newIndex);
  };

  const prevSlide = () => {
    const newIndex = Math.max(currentSlide - 1, 0);
    scrollToSlide(newIndex);
  };

  return (
    <section className="bg-white pt-20 pb-24 relative z-10">

      {/* HEADINGS */}
      <p className="text-center text-xs tracking-[0.4em] text-gray-500 mb-3">
        AUTUMN / WINTER
      </p>

      <h2 className="text-center text-4xl md:text-5xl font-semibold mb-20">
        Campaign Styles
      </h2>

      {/* ================= DESKTOP ================= */}
      <div className="hidden md:grid grid-cols-3 gap-10 max-w-[1500px] mx-auto px-10">
        {items.map((item, i) => (
          <Link key={i} to={item.link}>
            <div className="group">
              <div className="overflow-hidden h-[560px]">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
              </div>

              <div className="text-center mt-6">
                <h3 className="tracking-[0.15em] text-sm font-medium mb-2 uppercase">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3">{item.desc}</p>
                <span className="relative inline-block text-sm group">
                  Check Now
                  <span className="absolute left-0 bottom-0 w-full h-[1px] bg-black scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"/>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ================= MOBILE SLIDER ================= */}
      <div className="md:hidden">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth"
          style={{
            touchAction: "pan-y pan-x",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {items.map((item, i) => (
            <Link
              key={i}
              to={item.link}
              /* ⭐ FIX: snap-always dhaan intermediate slides skip aaguradha thadukkum */
              className="w-full shrink-0 snap-start snap-always px-4"
            >
              <div>
                {/* IMAGE + MOBILE ARROWS */}
                <div className="relative h-[460px] overflow-hidden rounded-sm">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />

                  {/* PREV */}
                  {currentSlide > 0 && (
                    <button
                      onClick={(e) => { e.preventDefault(); prevSlide(); }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full shadow-md flex items-center justify-center z-20"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                    </button>
                  )}

                  {/* NEXT */}
                  {currentSlide < items.length - 1 && (
                    <button
                      onClick={(e) => { e.preventDefault(); nextSlide(); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full shadow-md flex items-center justify-center z-20"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* TEXT */}
                <div className="text-center mt-6 px-2">
                  <h3 className="tracking-[0.15em] text-sm font-medium mb-2 uppercase">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">{item.desc}</p>
                  <span className="relative inline-block text-sm border-b border-black pb-0.5">
                    Check Now
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* DOTS */}
        <div className="flex justify-center mt-8 gap-3">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToSlide(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentSlide === i ? "bg-black w-5" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}