export default function SaleScrollingText() {
  const text = "Most Wanted Deals";

  return (
    <section className="bg-[#f1ede9] overflow-hidden py-6 relative md:py-8 z-10">

      <div className="relative whitespace-nowrap">

        {/* FIRST MARQUEE */}
        <div className="flex gap-[100px] animate-marquee w-max">
          {Array.from({ length: 12 }).map((_, i) => (
            <h2
              key={i}
              className="text-xl md:text-2xl font-medium tracking-wide"
            >
              {text}
            </h2>
          ))}
        </div>

        {/* SECOND MARQUEE (seamless loop) */}
        <div className="absolute top-0 flex gap-[100px] animate-marquee2 w-max">
          {Array.from({ length: 12 }).map((_, i) => (
            <h2
              key={i}
              className="text-xl md:text-2xl font-medium tracking-wide"
            >
              {text}
            </h2>
          ))}
        </div>

      </div>

    </section>
  );
}
