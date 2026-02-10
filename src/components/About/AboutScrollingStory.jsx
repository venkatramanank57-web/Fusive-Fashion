import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const sections = [
  {
    title: "WHAT WE STAND FOR",
    text: `We carefully curate apparel and handbags that blend quality,
comfort, and sophistication. Every detail matters – from design to
craftsmanship – ensuring pieces that last and elevate your everyday wardrobe.`,
    btn: "Discover now",
    imgDesktop:
      "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/velour-main-2b.jpg?v=1756901925&width=2000",
    imgMobile:
      "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/velour-main-2.jpg?v=1756798569&width=1500",
  },
  {
    title: "OUR STORY",
    text: `Born from a passion for timeless style and modern elegance,
our brand is dedicated to creating fashion that empowers and inspires.`,
    btn: "Discover now",
    imgDesktop:
      "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/velour-main-1b.jpg?v=1756901926&width=2000",
    imgMobile:
      "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/velour-main-1.jpg?v=1756798341&width=1500",
  },
];

export default function AboutScrollingStory() {
  const sectionRef = useRef(null);
  const [active, setActive] = useState(0);

  /* SIMPLE SCROLL DETECTION (WORKS EVERYWHERE) */
  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const progress = (windowHeight - rect.top) / (windowHeight + rect.height);

      if (progress > 0.5) setActive(1);
      else setActive(0);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#F4F0EB]">

      {/* ================= DESKTOP ================= */}
      <div className="hidden md:block h-[250vh] relative">

        <div className="sticky top-0 h-screen max-w-[1300px] mx-auto grid grid-cols-2 gap-20 items-center px-8">

          {/* LEFT FIXED IMAGE */}
          <div className="relative h-[600px]">
            {sections.map((item, i) => (
              <img
                key={i}
                src={item.imgDesktop}
                alt=""
                className="absolute w-full h-full object-cover transition-opacity duration-700"
                style={{ opacity: active === i ? 1 : 0 }}
              />
            ))}
          </div>

          {/* RIGHT CENTER TEXT */}
          <div className="relative">
            {sections.map((item, i) => (
              <div
                key={i}
                className={`absolute transition-all duration-700 max-w-[450px]
                ${active === i ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              >
                <h2 className="text-4xl tracking-widest mb-6">{item.title}</h2>
                <p className="text-gray-700 leading-relaxed mb-6">{item.text}</p>
                <button className="underline">{item.btn}</button>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ================= MOBILE SLIDER ================= */}
      <div className="md:hidden pb-16">
        <Swiper
          modules={[Navigation, Pagination]}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          className="px-4"
        >
          {sections.map((item, i) => (
            <SwiperSlide key={i}>
              <img src={item.imgMobile} className="w-full h-[420px] object-cover" />
              <div className="px-6 py-8">
                <h2 className="text-2xl mb-4">{item.title}</h2>
                <p className="text-gray-700 mb-4">{item.text}</p>
                <button className="underline">{item.btn}</button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

    </section>
  );
}
