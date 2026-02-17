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
  const scrollTimeout = useRef(null); // ⭐ debounce timer
  const [index, setIndex] = useState(0);

  /* Scroll when dots/arrows clicked */
  const scrollToIndex = (i) => {
    const width = sliderRef.current.offsetWidth;
    sliderRef.current.scrollTo({ left: width * i, behavior: "smooth" });
    setIndex(i);
  };

  const next = () => scrollToIndex(Math.min(index + 1, posts.length - 1));
  const prev = () => scrollToIndex(Math.max(index - 1, 0));

  /* ⭐ PRODUCTION MOBILE SCROLL FIX */
  const handleScroll = () => {
    if (!sliderRef.current) return;

    // clear old timer
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

    // run ONLY after scrolling stops
    scrollTimeout.current = setTimeout(() => {
      const container = sliderRef.current;
      const slideWidth = container.offsetWidth;

      // ⭐ prevents slide skipping
      const newIndex = Math.floor(
        (container.scrollLeft + slideWidth / 2) / slideWidth
      );

      setIndex(newIndex);
    }, 120);
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

      <div className="relative">

        {/* MOBILE PREV */}
        {/* {index > 0 && (
          <button
            onClick={prev}
            className="lg:hidden absolute left-4 top-[40%] z-10 w-11 h-11 bg-white/90 rounded-full shadow flex items-center justify-center"
          >
            <ChevronLeft size={20} />
          </button>
        )} */}

        {/* MOBILE NEXT */}
        {/* {index < posts.length - 1 && (
          <button
            onClick={next}
            className="lg:hidden absolute right-4 top-[40%] z-10 w-11 h-11 bg-white/90 rounded-full shadow flex items-center justify-center"
          >
            <ChevronRight size={20} />
          </button>
        )} */}

        {/* SLIDER */}
        <div
          ref={sliderRef}
          onScroll={handleScroll}
          className="flex lg:grid lg:grid-cols-3 overflow-x-auto lg:overflow-visible snap-x snap-mandatory scrollbar-hide"
          style={{
            touchAction: "pan-y pan-x",
            WebkitOverflowScrolling: "touch",
            overscrollBehaviorX: "contain",
          }}
        >
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {/* DOTS */}
        <div className="flex lg:hidden justify-center mt-6 gap-2">
          {posts.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition ${
                index === i ? "bg-black" : "bg-gray-300"
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
    <div className="w-full flex-shrink-0 lg:min-w-0 snap-start">

      <div className="overflow-hidden h-[380px] sm:h-[420px] lg:aspect-square lg:h-auto">
        <img
          src={post.img}
          alt={post.title}
          className="w-full h-full object-cover hover:scale-105 transition duration-500"
        />
      </div>

      <div className="bg-[#f3f3f3] text-center px-6 py-8 lg:py-10">
        <h3 className="tracking-[2px] text-[18px] lg:text-[20px] font-medium text-[#2b2b2b] mb-4">
          {post.title}
        </h3>

        <p className="text-[#4a4a4a] text-[14px] leading-relaxed mb-6 max-w-[320px] mx-auto">
          {post.desc}
        </p>

        <button className="border-b border-[#2b2b2b] pb-1 text-[14px] font-medium">
          Read more
        </button>
      </div>

    </div>
  );
}
