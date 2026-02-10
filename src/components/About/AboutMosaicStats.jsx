export default function AboutMosaicStats() {
  return (
    <section className="w-full bg-white">
      <div className="grid md:grid-cols-[60%_40%] w-full">

        {/* ================= LEFT BIG IMAGE ================= */}
        <div className="relative h-[420px] md:h-[650px] overflow-hidden">
          <img
            src="https://wonder-theme-fashion.myshopify.com/cdn/shop/files/image-rylko-collage-desktop.jpg?v=1755469752&width=2500"
            alt="Artisans"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* TEXT */}
          <div className="absolute bottom-14 left-12 md:left-16 text-[#222] max-w-md">
            <h2 className="text-4xl md:text-[56px] font-light tracking-wide mb-4">
              30+ ARTISANS
            </h2>

            <p className="text-lg leading-relaxed text-gray-700">
              work with us to handcraft each
              <br />
              unique piece with care and precision.
            </p>
          </div>
        </div>

        {/* ================= RIGHT STACK ================= */}
        <div className="flex flex-col">

          {/* ===== TOP CARD ===== */}
          <div className="relative bg-[#E9E3DA] h-[210px] md:h-[325px] flex items-center">
            <div className="px-10 md:px-16">
              <h2 className="text-[64px] md:text-[90px] font-light mb-3 text-[#222]">
                40%
              </h2>

              <p className="text-gray-700 text-lg max-w-md">
                less water is used in our production compared to
                traditional manufacturing methods.
              </p>
            </div>
          </div>

          {/* ===== BOTTOM CARD ===== */}
          <div className="relative bg-[#1E1E1E] h-[210px] md:h-[325px] flex items-center">
            <div className="px-10 md:px-16 text-white">
              <h2 className="text-[64px] md:text-[90px] font-light mb-3">
                99%
              </h2>

              <p className="text-lg max-w-md text-gray-300">
                of our fabrics come from recycled or upcycled sources.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
