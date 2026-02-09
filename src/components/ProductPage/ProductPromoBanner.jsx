export default function ProductPromoBanner() {
  return (
    <section className="grid md:grid-cols-2 w-full">

      {/* LEFT IMAGE */}
      <div className="order-1 md:order-none h-[320px] sm:h-[420px] md:h-[560px] z-10">
        <img
          src="https://wonder-theme-fashion.myshopify.com/cdn/shop/files/1-mobile-fashion.jpg"
          alt="Evening dress"
          className="w-full h-full object-cover"
          style={{ objectPosition: "52% 2%" }}
        />
      </div>

      {/* RIGHT CONTENT */}
      <div className="order-2 md:order-none bg-[#c4b9ae] flex items-center justify-center text-center px-6 py-14 md:py-0 z-10">
        <div className="max-w-md text-white">

          <p className="tracking-[0.25em] uppercase text-xs sm:text-sm mb-4 sm:mb-6 opacity-90">
            The brand's latest campaign
          </p>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light mb-8 md:mb-10 leading-tight">
            EVENING <br className="hidden sm:block" /> DRESS
          </h2>

          <a
            href="/products/fitted-dress-with-ruffles"
            className="inline-block bg-white text-black px-8 sm:px-10 py-3 text-sm tracking-wider hover:opacity-80 transition"
          >
            Check now
          </a>

        </div>
      </div>

    </section>
  );
}
