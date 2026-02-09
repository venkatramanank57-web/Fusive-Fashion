import { Link } from "react-router-dom";

export default function BagsSaleBanner() {
  return (
    <section className="grid md:grid-cols-2 w-full relative z-10">

      {/* IMAGE — MOBILE TOP / DESKTOP RIGHT */}
      <div className="order-1 md:order-2 h-[220px] sm:h-[260px] md:h-[420px]">
        <img
          src="https://wonder-theme-fashion.myshopify.com/cdn/shop/files/rylko-sale.jpg"
          alt="Bags Sale"
          className="w-full h-full object-cover"
        />
      </div>

      {/* TEXT — MOBILE BOTTOM / DESKTOP LEFT */}
      <div className="order-2 md:order-1 bg-[#FAE6E6] flex items-center justify-center text-center md:text-left px-8 py-12 md:py-0">
        <div className="max-w-md">

          <h2 className="text-2xl sm:text-3xl md:text-5xl font-light mb-6 md:mb-8 leading-tight">
            DON'T MISS OUT <br /> BAGS SALE
          </h2>

          <Link
            to="/collections/bags"
            className="inline-block border border-black px-7 py-3 text-sm tracking-wider hover:bg-black hover:text-white transition"
          >
            Up to 50% Off
          </Link>

        </div>
      </div>

    </section>
  );
}
