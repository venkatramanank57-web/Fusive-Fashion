import { useQuery } from "@apollo/client/react";
import ProductCard from "../ProductCard";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CollectionSlider({ title, query, variables }) {
  const { data, loading, error } = useQuery(query, { variables });

  const scrollRef = useRef(null);
  const scrollTimeout = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Normalize Shopify response
  const products =
    data?.collection?.products?.edges ||
    data?.products?.edges ||
    [];

  // Responsive items per slide
  const getItemsPerSlide = () => (window.innerWidth >= 768 ? 4 : 2);
  const [itemsPerSlide, setItemsPerSlide] = useState(getItemsPerSlide());

  useEffect(() => {
    const resize = () => setItemsPerSlide(getItemsPerSlide());
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const totalSlides = Math.ceil(products.length / itemsPerSlide);

  // Scroll to slide (buttons)
  const scrollToSlide = (index) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const slideWidth = container.offsetWidth;

    container.scrollTo({
      left: slideWidth * index,
      behavior: "smooth",
    });

    setCurrentSlide(index);
  };

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      scrollToSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      scrollToSlide(currentSlide - 1);
    }
  };

  // ✅ FIXED: update slide ONLY after scrolling stops
  const handleScroll = () => {
    if (!scrollRef.current) return;

    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    scrollTimeout.current = setTimeout(() => {
      const container = scrollRef.current;
      const slideWidth = container.offsetWidth;

      const newSlide = Math.floor(
        (container.scrollLeft + slideWidth / 2) / slideWidth
      );

      setCurrentSlide(newSlide);
    }, 120); // 👈 slows perception, fixes UX
  };

  if (loading) return null;
  if (error || !products.length) return null;

  return (
    <section className="bg-white py-14 md:py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4">

        {/* TITLE */}
        {title && (
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-semibold">{title}</h2>
          </div>
        )}

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
            onWheel={(e) => {
              // 👇 Slow horizontal scroll on desktop
              if (window.innerWidth >= 768) {
                e.preventDefault();
                scrollRef.current.scrollLeft += e.deltaY * 0.4;
              }
            }}
            className="flex overflow-x-auto snap-x snap-mandatory pb-2"
            style={{
              scrollBehavior: "smooth",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              overscrollBehaviorX: "contain",
            }}
          >
            <style>{`div::-webkit-scrollbar { display: none; }`}</style>

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

          {/* PROGRESS BAR */}
          {totalSlides > 1 && (
            <div className="w-full mt-10">
              <div className="h-[4px] bg-gray-200 relative overflow-hidden">
                <div
                  className="absolute h-full bg-black transition-transform duration-300"
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
