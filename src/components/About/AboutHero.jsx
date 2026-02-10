import { Link } from "react-router-dom";

export default function AboutHero() {
  return (
    <section className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden">

      {/* BACKGROUND IMAGE */}
      <picture>
        {/* Mobile */}
        <source
          media="(max-width:768px)"
          srcSet="https://wonder-theme-fashion.myshopify.com/cdn/shop/files/about-us-bg-wonder-mobile.jpg?v=1725988966&width=1500"
        />

        {/* Desktop */}
        <img
          src="https://wonder-theme-fashion.myshopify.com/cdn/shop/files/about-us-bg-wonder-transformed.jpg?v=1725987967&width=3840"
          alt="About us"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </picture>

      {/* DARK OVERLAY (for text readability) */}
      <div className="absolute inset-0 bg-black/30" />

      {/* CONTENT */}
      <div className="relative h-full max-w-7xl mx-auto px-6 flex items-center">

        <div className="text-white max-w-xl">

          {/* HEADING */}
          <h1 className="text-4xl md:text-6xl font-semibold mb-6">
            About Us
          </h1>

          {/* SUBTEXT */}
          <p className="text-lg md:text-xl mb-8 text-gray-200">
            Elevate Your Style with Premium and Long-lasting Luxury Goods.
          </p>

          {/* BUTTON */}
          <Link
            to="/shop-by-collections"
            className="
              inline-block
              border border-white
              px-8 py-3
              text-sm tracking-wide
              hover:bg-white hover:text-black
              transition
            "
          >
            View products
          </Link>

        </div>
      </div>

    </section>
  );
}
