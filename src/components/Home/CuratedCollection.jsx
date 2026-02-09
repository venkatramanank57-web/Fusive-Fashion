import { useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function CuratedCollection() {
  const scrollRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const items = [
    {
      title: "Savanna Chic",
      link: "/products/elegant-leopard-print-handbag",
      img: "//wonder-theme-fashion.myshopify.com/cdn/shop/files/rylko-bag-4.jpg?v=1754865021&width=1200",
    },
    {
      title: "Midnight Luxe",
      link: "/products/elegant-handbag-with-gold-details",
      img: "//wonder-theme-fashion.myshopify.com/cdn/shop/files/rylko-bag-3.jpg?v=1754864939&width=1200",
    },
    {
      title: "Champagne Whisper",
      link: "/products/platinum-handbag-with-decorative-flap",
      img: "//wonder-theme-fashion.myshopify.com/cdn/shop/files/rylko-bag-2.jpg?v=1754864863&width=1200",
    },
    {
      title: "Urban Muse",
      link: "/products/elegant-handbag",
      img: "//wonder-theme-fashion.myshopify.com/cdn/shop/files/rylko-bag-1.jpg?v=1754864793&width=1200",
    },
  ];

  const scrollToSlide = (index) => {
    const container = scrollRef.current;
    if (!container) return;
    const width = container.offsetWidth;
    container.scrollTo({ left: width * index, behavior: "smooth" });
    setCurrentSlide(index);
  };

  const handleScroll = () => {
    const container = scrollRef.current;
    const slideWidth = container.offsetWidth;
    const newSlide = Math.round(container.scrollLeft / slideWidth);
    setCurrentSlide(newSlide);
  };

  return (
    <section className="bg-[#f1f1f1] py-16 md:py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6">

        {/* ⭐ HEADING UPDATED */}
        <h2 className="text-center uppercase tracking-[0.25em] text-[#1a1a1a] text-2xl md:text-3xl font-semibold mb-16">
          Curated From The House
        </h2>

        {/* ⭐ DESKTOP GAP INCREASED */}
        <div className="hidden md:grid grid-cols-4 gap-10">
          {items.map((item, i) => (
            <Link key={i} to={item.link}>
              <div className="relative h-[420px] overflow-hidden group transition-all duration-500">
                
                <img
                  src={item.img}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-out"
                />

                <div className="absolute inset-0" />

                <div className="absolute bottom-10 left-0 right-0 text-center text-[#1a1a1a]">
                  <span className="border-b border-[#1a1a1a] pb-1 text-lg">
                    {item.title}
                  </span>
                </div>

              </div>
            </Link>
          ))}
        </div>

        {/* MOBILE SLIDER */}
        <div className="md:hidden relative">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          >
            {items.map((item, index) => (
              <Link key={index} to={item.link} className="min-w-full snap-start px-2">
                <div className="relative h-[420px] overflow-hidden rounded-md">
                  <img
                    src={item.img}
                    className="absolute inset-0 w-full h-full object-cover"
                    alt=""
                  />
                  <div className="absolute inset-0" />

                  <div className="absolute bottom-10 left-0 right-0 text-center text-[#1a1a1a]">
                    <span className="border-b border-[#1a1a1a] pb-1 text-lg">
                      {item.title}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* DOTS */}
          <div className="flex justify-center mt-6 gap-3">
            {items.map((_, i) => (
              <div
                key={i}
                onClick={() => scrollToSlide(i)}
                className={`w-3 h-3 rounded-full cursor-pointer transition ${
                  currentSlide === i ? "bg-black" : "bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
