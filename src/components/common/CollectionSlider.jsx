import { useQuery } from "@apollo/client/react";
import ProductCard from "../ProductCard";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CollectionSlider({ title, query, variables }) {
  const { data, loading, error } = useQuery(query, { variables });

  const scrollRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  // Shopify response normalize
  const products =
    data?.collection?.products?.edges ||
    data?.products?.edges ||
    [];

  // Responsive items per slide
  const getItemsPerSlide = () => (typeof window !== 'undefined' && window.innerWidth >= 768 ? 4 : 2);
  const [itemsPerSlide, setItemsPerSlide] = useState(2);

  useEffect(() => {
    setItemsPerSlide(getItemsPerSlide());
    const resize = () => setItemsPerSlide(getItemsPerSlide());
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const totalSlides = Math.ceil(products.length / itemsPerSlide);

  const scrollToSlide = (index) => {
    if (!scrollRef.current || isScrolling) return;
    
    setIsScrolling(true);
    const container = scrollRef.current;
    const slideWidth = container.offsetWidth;
    
    container.scrollTo({ left: slideWidth * index, behavior: "smooth" });
    setCurrentSlide(index);
    
    // Lock release timing
    setTimeout(() => {
      setIsScrolling(false);
    }, 500); 
  };

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1 && !isScrolling) {
      scrollToSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0 && !isScrolling) {
      scrollToSlide(currentSlide - 1);
    }
  };

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container || isScrolling) return;
    
    const slideWidth = container.offsetWidth;
    // Math.round ensures we sync the dots/progress bar correctly
    const newSlide = Math.round(container.scrollLeft / slideWidth);
    
    if (newSlide !== currentSlide) {
      setCurrentSlide(newSlide);
    }
  };

  if (loading) return null;
  if (error || !products.length) return null;

  return (
    <section className="bg-white py-14 md:py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4">

        {/* TITLE */}
        {title && (
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-semibold font-primary">{title}</h2>
          </div>
        )}

        <div className="relative">

          {/* PREV BUTTON */}
          {currentSlide > 0 && (
            <button
              onClick={prevSlide}
              disabled={isScrolling}
              className={`hidden md:flex absolute -left-12 lg:-left-16 top-1/2 -translate-y-1/2 
                         z-20 bg-white shadow-xl p-3 rounded-full hover:scale-110 transition
                         ${isScrolling ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ChevronLeft />
            </button>
          )}

          {/* NEXT BUTTON */}
          {currentSlide < totalSlides - 1 && (
            <button
              onClick={nextSlide}
              disabled={isScrolling}
              className={`hidden md:flex absolute -right-12 lg:-right-16 top-1/2 -translate-y-1/2 
                         z-20 bg-white shadow-xl p-3 rounded-full hover:scale-110 transition
                         ${isScrolling ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ChevronRight />
            </button>
          )}

          {/* SCROLL AREA */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory pb-2 scroll-smooth"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch", // Mobile smooth control
            }}
          >
            <style>{`div::-webkit-scrollbar { display: none; }`}</style>

            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
              <div
                key={slideIndex}
                /* ⭐ FIX: 'snap-always' class add panniruken. 
                   Idhu dhaan user fast-ah scroll pannaalum momentum-ah adutha slide-laye stop pannum. 
                */
                className="min-w-full snap-start snap-always grid grid-cols-2 md:grid-cols-4 gap-4 px-2"
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

          {/* ⭐ PROGRESS BAR */}
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