import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    logo: "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/vogue-logo-2.png",
    text: `"A brand that challenges the industry. A brand that has a chance to stage a revolution. A brand whose creators see it as a step towards a better world"`,
  },
  {
    logo: "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/baz-logo-new.png",
    text: `"Get ready to slay in style with our Fashion store - the ultimate destination for all things fabulous!"`,
  },
];

export default function PressSlider() {
  const [index, setIndex] = useState(0);

  const next = () => setIndex(index + 1);
  const prev = () => setIndex(index - 1);

  const item = testimonials[index];

  return (
    <section className="bg-[#f1ede9] py-16 lg:py-24 relative z-10">

      {/* LEFT ARROW — SHOW ONLY WHEN POSSIBLE */}
      {index > 0 && (
        <button
          onClick={prev}
          className="hidden lg:flex absolute left-6 top-1/2 -translate-y-1/2 
          p-4 rounded-full bg-white shadow-md hover:scale-110 transition"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* RIGHT ARROW — SHOW ONLY WHEN POSSIBLE */}
      {index < testimonials.length - 1 && (
        <button
          onClick={next}
          className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 
          p-4 rounded-full bg-white shadow-md hover:scale-110 transition"
        >
          <ChevronRight size={24} />
        </button>
      )}

      {/* CONTENT */}
      <div className="max-w-[900px] mx-auto px-6 text-center">

        {/* LOGO */}
        <img
          src={item.logo}
          alt="press logo"
          className="mx-auto mb-10 w-[120px] lg:w-[160px]"
        />

        {/* QUOTE */}
        <p className="text-[20px] lg:text-[26px] leading-relaxed text-[#2b2b2b] font-light max-w-[700px] mx-auto">
          {item.text}
        </p>

        {/* DOTS */}
        <div className="flex justify-center mt-10 gap-3">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
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
