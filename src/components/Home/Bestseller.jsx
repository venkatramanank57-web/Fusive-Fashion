// =====================================
// src/components/Home/Bestseller.jsx
// FINAL POLISHED VERSION 🔥
// =====================================

import { useQuery } from "@apollo/client/react";
import { GET_BESTSELLERS } from "../../api/shopify/bestsellerCollection";
import ProductCard from "../ProductCard";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Bestseller() {
  const { data, loading, error } = useQuery(GET_BESTSELLERS);

  const scrollRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const products = data?.collection?.products?.edges || [];

  // Responsive items per slide
  const getItemsPerSlide = () => (window.innerWidth >= 768 ? 4 : 2);
  const [itemsPerSlide, setItemsPerSlide] = useState(getItemsPerSlide());

  useEffect(() => {
    const resize = () => setItemsPerSlide(getItemsPerSlide());
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const totalSlides = Math.ceil(products.length / itemsPerSlide);

  // Scroll to slide
  const scrollToSlide = (index) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const slideWidth = container.offsetWidth;
    container.scrollTo({ left: slideWidth * index, behavior: "smooth" });
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) scrollToSlide(currentSlide + 1);
  };

  const prevSlide = () => {
    if (currentSlide > 0) scrollToSlide(currentSlide - 1);
  };

  // Detect swipe scroll (mobile)
  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;
    const slideWidth = container.offsetWidth;
    const newSlide = Math.round(container.scrollLeft / slideWidth);
    setCurrentSlide(newSlide);
  };

  // STATES
  if (loading) return <div className="py-20 text-center">Loading...</div>;
  if (error) return <div className="py-20 text-center">Error loading products</div>;
  if (!products.length) return null;

  return (
    <section className="bg-white py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-4">

        {/* TITLE */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold">Best Seller</h2>
        </div>

        <div className="relative">

          {/* PREV BUTTON */}
          {currentSlide > 0 && (
            <button
              onClick={prevSlide}
              className="hidden md:flex absolute -left-12 lg:-left-16 top-1/2 -translate-y-1/2 
                         z-20 bg-white shadow-xl p-3 rounded-full hover:scale-110 transition"
            >
              <ChevronLeft />
            </button>
          )}

          {/* NEXT BUTTON */}
          {currentSlide < totalSlides - 1 && (
            <button
              onClick={nextSlide}
              className="hidden md:flex absolute -right-12 lg:-right-16 top-1/2 -translate-y-1/2 
                         z-20 bg-white shadow-xl p-3 rounded-full hover:scale-110 transition"
            >
              <ChevronRight />
            </button>
          )}

          {/* SCROLL AREA */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory pb-2"
            style={{
              scrollBehavior: "smooth",
              scrollbarWidth: "none",      // Firefox
              msOverflowStyle: "none",     // IE
            }}
          >
            {/* Hide scrollbar Chrome */}
            <style>
              {`div::-webkit-scrollbar { display: none; }`}
            </style>

            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
              <div
                key={slideIndex}
                className="min-w-full snap-start grid grid-cols-2 md:grid-cols-4 gap-4 px-2"
              >
                {products
                  .slice(
                    slideIndex * itemsPerSlide,
                    slideIndex * itemsPerSlide + itemsPerSlide
                  )
                  .map(({ node }) => (
                    <ProductCard key={node.id} product={node} />
                  ))}
              </div>
            ))}
          </div>

          {/* ⭐ FULL WIDTH BOTTOM PROGRESS BAR */}
          {totalSlides > 1 && (
            <div className="w-full mt-10">
              <div className="h-[4px] bg-gray-200 relative">
                <div
                  className="absolute h-full bg-black transition-all duration-300"
                  style={{
                    width: `${100 / totalSlides}%`,
                    transform: `translateX(${currentSlide * 100}%)`,
                  }}
                />
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
