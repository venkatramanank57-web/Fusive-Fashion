import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Monica D.",
    image:
      "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/testimonial-women-3.jpg",
    text: "I love shopping at Velour because the clothes are stylish and comfortable. Customer service is always helpful, and the orders arrive super fast.",
  },
  {
    id: 2,
    name: "Anna K.",
    image:
      "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/testimonial-women-1.jpg",
    text: "Velour is my favorite clothing store – I always find something unique. The fabrics are great quality and the designs are very feminine and elegant.",
  },
  {
    id: 3,
    name: "Julie B.",
    image:
      "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/testimonial-women-2.jpg",
    text: "Velour is a guarantee of great style – the clothes look exactly like in the photos. I feel amazing wearing them and often get compliments.",
  },
];

export default function TestimonialsSlider() {
  const [index, setIndex] = useState(1);

  const next = () => {
    if (index < testimonials.length - 1) setIndex(index + 1);
  };

  const prev = () => {
    if (index > 0) setIndex(index - 1);
  };

  const t = testimonials[index];

  return (
    <section className="bg-[#f5f5f5] py-16 md:py-20 relative overflow-hidden z-10">
      
      {/* CENTER CONTENT */}
      <div className="max-w-4xl mx-auto text-center px-6 relative">

        {/* TITLE */}
        <h2 className="text-lg tracking-[0.25em] mb-10">
          +1000 HAPPY CUSTOMERS
        </h2>

        {/* PREV BUTTON */}
        {index > 0 && (
          <button
            onClick={prev}
            className="absolute left-4 md:left-10 lg:left-16 top-1/2 -translate-y-1/2 
                       p-4 text-gray-500 hover:text-black transition"
          >
            <ChevronLeft size={30} />
          </button>
        )}

        {/* NEXT BUTTON */}
        {index < testimonials.length - 1 && (
          <button
            onClick={next}
            className="absolute right-4 md:right-10 lg:right-16 top-1/2 -translate-y-1/2 
                       p-4 text-gray-500 hover:text-black transition"
          >
            <ChevronRight size={30} />
          </button>
        )}

        {/* IMAGE */}
        <img
          src={t.image}
          alt={t.name}
          className="w-24 h-24 mx-auto rounded-full object-cover mb-6"
        />

        {/* STARS */}
        <div className="flex justify-center mb-6 text-xl">
          {"★★★★★".split("").map((_, i) => (
            <span key={i}>★</span>
          ))}
        </div>

        {/* TEXT */}
        <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-8">
          “{t.text}”
        </p>

        {/* AUTHOR */}
        <p className="mb-10">- {t.name}</p>

        {/* DOTS */}
        <div className="flex justify-center gap-3">
          {testimonials.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition ${
                i === index ? "bg-black scale-110" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

      </div>

      {/* 🔥 WIDE SHOPIFY DIVIDER (FULL PAGE WIDTH) */}
      <div className="max-w-7xl mx-auto px-6 mt-16">
        <hr className="border-gray-300" />
      </div>

    </section>
  );
}
