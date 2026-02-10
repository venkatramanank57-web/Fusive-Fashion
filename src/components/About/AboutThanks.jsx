export default function AboutThanks() {
  return (
    <section className="py-16 md:py-24 bg-white text-center">
      <div className="max-w-5xl mx-auto px-6">

        {/* SMALL TEXT */}
        <p className="text-gray-600 mb-6 text-lg">
          Big Thanks
        </p>

        {/* BIG HEADING WITH INLINE IMAGES */}
        <h2 className="text-2xl md:text-4xl font-light leading-relaxed">
          We could not have created this demo without the help of an amazing
          source of content and products. We extend our sincere appreciation to{" "}

          {/* IMAGE 1 */}
          <img
            src="https://wonder-theme-fashion.myshopify.com/cdn/shop/files/dress.jpg?v=1755978634&width=200"
            alt="Dress"
            className="inline w-14 h-14 md:w-16 md:h-16 object-cover rounded-full mx-2 align-middle transition-transform duration-300 hover:scale-110 cursor-pointer"
          />

          Cudmoda.pl and{" "}

          {/* IMAGE 2 */}
          <img
            src="https://wonder-theme-fashion.myshopify.com/cdn/shop/files/bag.jpg?v=1755978398&width=200"
            alt="Bag"
            className="inline w-14 h-14 md:w-16 md:h-16 object-cover rounded-full mx-2 align-middle transition-transform duration-300 hover:scale-110 cursor-pointer"
          />

          Rylko.com for generously allowing us to showcase their product
          images on{" "}

          {/* IMAGE 3 */}
          <img
            src="https://wonder-theme-fashion.myshopify.com/cdn/shop/files/testimonial-women-1.jpg?v=1755946343&width=200"
            alt="Customer"
            className="inline w-14 h-14 md:w-16 md:h-16 object-cover rounded-full mx-2 align-middle transition-transform duration-300 hover:scale-110 cursor-pointer"
          />

          our demo store.
        </h2>

      </div>
    </section>
  );
}
