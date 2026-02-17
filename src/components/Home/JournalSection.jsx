import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const posts = [
  {
    id: 1,
    title: "HOW TO DRESS FOR THE OFFICE?",
    desc: "Choosing the right outfit for the office can sometimes be a challenge...",
    img: "https://wonder-theme-fashion.myshopify.com/cdn/shop/articles/blog-2-article-2-wonder-couture.jpg",
  },
  {
    id: 2,
    title: "HOW TO CHOOSE THE RIGHT SKIRT LENGTH?",
    desc: "The right skirt length can enhance your figure...",
    img: "https://wonder-theme-fashion.myshopify.com/cdn/shop/articles/blog-5.jpg",
  },
  {
    id: 3,
    title: "BLAZER AND OFFICE STYLE",
    desc: "The blazer is a staple piece in office fashion...",
    img: "https://wonder-theme-fashion.myshopify.com/cdn/shop/articles/blog-3-article-3-wonder-couture.jpg",
  },
];

export default function JournalSection() {
  const sliderRef = useRef(null);
  const [index, setIndex] = useState(0);

  /* Scroll when dots clicked */
  const scrollToIndex = (i) => {
    if (!sliderRef.current) return;
    const width = sliderRef.current.offsetWidth;
    sliderRef.current.scrollTo({ left: width * i, behavior: "smooth" });
    setIndex(i);
  };

  /* ⭐ FIXED SCROLL DETECTION ⭐ */
  const handleScroll = () => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    const slideWidth = container.offsetWidth;
    
    // Smooth-ah index detect panna Math.round use pannalam
    const newIndex = Math.round(container.scrollLeft / slideWidth);
    
    if (newIndex !== index && newIndex < posts.length) {
      setIndex(newIndex);
    }
  };

  return (
    <section className="bg-[#f3f3f3] pt-8 lg:pt-12 pb-12 lg:pb-16 relative z-10">

      {/* HEADER */}
      <div className="max-w-[1300px] mx-auto px-6 text-center mb-8 lg:mb-12">
        <p className="uppercase tracking-[3px] text-[12px] text-gray-500 mb-2">
          Fashion Blog
        </p>
        <h2 className="text-[28px] lg:text-[42px] font-light tracking-wide">
          Journal
        </h2>
      </div>

      <div className="relative overflow-hidden">

        {/* SLIDER CONTAINER */}
        <div
          ref={sliderRef}
          onScroll={handleScroll}
          // ⭐ FIXED CSS CLASSES: snap-always logic inga dhaan iruku
          className="flex lg:grid lg:grid-cols-3 overflow-x-auto lg:overflow-visible snap-x snap-mandatory scrollbar-hide scroll-smooth"
          style={{
            touchAction: "pan-y pan-x",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <style>{`div::-webkit-scrollbar { display: none; }`}</style>
          
          {posts.map((post) => (
            <div 
              key={post.id} 
              // ⭐ MUKKIYAM: snap-always added here
              className="w-full shrink-0 snap-start snap-always"
            >
              <BlogCard post={post} />
            </div>
          ))}
        </div>

        {/* DOTS */}
        <div className="flex lg:hidden justify-center mt-6 gap-3">
          {posts.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              className={`transition-all duration-300 rounded-full ${
                index === i ? "w-6 h-2 bg-black" : "w-2 h-2 bg-gray-300"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

function BlogCard({ post }) {
  return (
    <div className="px-4">
      <div className="overflow-hidden h-[380px] sm:h-[420px] lg:aspect-square lg:h-auto rounded-sm shadow-sm">
        <img
          src={post.img}
          alt={post.title}
          className="w-full h-full object-cover hover:scale-105 transition duration-700"
        />
      </div>

      <div className="text-center px-2 py-8 lg:py-10">
        <h3 className="tracking-[1px] text-[18px] lg:text-[20px] font-medium text-[#2b2b2b] mb-4 uppercase">
          {post.title}
        </h3>

        <p className="text-[#4a4a4a] text-[14px] leading-relaxed mb-6 max-w-[320px] mx-auto line-clamp-3">
          {post.desc}
        </p>

        <button className="border-b border-[#2b2b2b] pb-1 text-[13px] font-semibold tracking-wider hover:text-gray-500 transition">
          READ MORE
        </button>
      </div>
    </div>
  );
}