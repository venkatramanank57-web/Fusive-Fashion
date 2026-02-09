export default function ProductMarqueeBanner() {
  return (
    <section className="relative w-full bg-[#f1ede9] overflow-hidden py-7 z-10">
      
      <div className="flex whitespace-nowrap animate-marquee ">
        {/* Repeat text multiple times */}
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="mx-14 text-sm md:text-base tracking-[0.3em] uppercase text-gray-700"
          >
            Featured this season
          </span>
        ))}
      </div>

    </section>
  );
}
