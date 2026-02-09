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
      desc: "It’s time to refresh with closet staples",
      img: "//wonder-theme-fashion.myshopify.com/cdn/shop/files/main-column-3.jpg?v=1708418480&width=1200",
      link: "/products/a-detachable-dress-at-the-waist-with-pleats",
    },
  ];

  /* mobile scroll */
  const scrollToSlide = (index) => {
    const container = scrollRef.current;
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

              {/* IMAGE */}
              <div className="overflow-hidden h-[560px]">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
              </div>

              {/* TEXT BELOW IMAGE */}
              <div className="text-center mt-6">
                <h3 className="tracking-[0.15em] text-sm font-medium mb-2">
                  {item.title}
                </h3>

                <p className="text-gray-600 text-sm mb-3">
                  {item.desc}
                </p>

                <span className="border-b border-black text-sm pb-1">
                  Check Now
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
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 gap-5"
        >
          {items.map((item, i) => (
            <Link key={i} to={item.link} className="min-w-full snap-start">

              <div>

                <div className="h-[460px] overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="text-center mt-6 px-4">
                  <h3 className="tracking-[0.15em] text-sm font-medium mb-2">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-3">
                    {item.desc}
                  </p>

                  <span className="border-b border-black text-sm pb-1">
                    Check Now
                  </span>
                </div>

              </div>

            </Link>
          ))}
        </div>

        {/* DOTS ONLY (no arrows) */}
        <div className="flex justify-center mt-6 gap-3">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToSlide(i)}
              className={`w-2.5 h-2.5 rounded-full ${
                currentSlide === i ? "bg-black" : "bg-gray-400"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
