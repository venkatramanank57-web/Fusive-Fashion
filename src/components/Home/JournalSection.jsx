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
  const sliderRef = useRef();
  const [index, setIndex] = useState(0);

  const scrollToIndex = (i) => {
    sliderRef.current.scrollTo({
      left: sliderRef.current.offsetWidth * i,
      behavior: "smooth",
    });
    setIndex(i);
  };

  const next = () => scrollToIndex(Math.min(index + 1, posts.length - 1));
  const prev = () => scrollToIndex(Math.max(index - 1, 0));

  return (
    <section className="bg-[#f3f3f3] pt-8 lg:pt-12 pb-12 lg:pb-16 relative z-10">

      {/* HEADER */}
      <div className="max-w-[1300px] mx-auto px-6 text-center mb-8 lg:mb-12">
        <p className="uppercase tracking-[3px] text-[12px] lg:text-[13px] text-gray-500 mb-2">
          Fashion Blog
        </p>
        <h2 className="text-[28px] lg:text-[42px] font-light tracking-wide">
          Journal
        </h2>
      </div>

      <div className="relative">

        {/* MOBILE ARROWS
        <button
          onClick={prev}
          className="lg:hidden absolute left-3 top-[42%] z-10 bg-white shadow-md p-2 rounded-full"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={next}
          className="lg:hidden absolute right-3 top-[42%] z-10 bg-white shadow-md p-2 rounded-full"
        >
          <ChevronRight size={20} />
        </button> */}

        {/* SLIDER / GRID */}
        <div
          ref={sliderRef}
          className="
            flex lg:grid lg:grid-cols-3
            overflow-x-auto lg:overflow-visible
            snap-x snap-mandatory scroll-smooth no-scrollbar
          "
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
              className={`w-2 h-2 rounded-full ${
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
    <div className="w-full flex-shrink-0 lg:min-w-0">

      {/* MOBILE IMAGE HEIGHT FIX */}
      <div className="overflow-hidden h-[380px] sm:h-[420px] lg:aspect-square lg:h-auto">
        <img
          src={post.img}
          alt={post.title}
          className="w-full h-full object-cover hover:scale-105 transition duration-500"
        />
      </div>

      {/* TEXT */}
      <div className="bg-[#f3f3f3] text-center px-6 py-8 lg:py-10">
        <h3 className="tracking-[2px] text-[18px] lg:text-[20px] font-medium text-[#2b2b2b] mb-4">
          {post.title}
        </h3>

        <p className="text-[#4a4a4a] text-[14px] leading-relaxed mb-6 max-w-[320px] mx-auto">
          {post.desc}
        </p>

        <button className="border-b border-[#2b2b2b] pb-1 text-[14px] font-medium text-[#2b2b2b]">
          Read more
        </button>
      </div>
    </div>
  );
}
