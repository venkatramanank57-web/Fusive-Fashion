import { Link } from "react-router-dom";

export default function LookbookCollectionsCTA() {
  return (
    <section className="w-full py-16 md:py-24 bg-white text-center">
      <div className="max-w-4xl mx-auto px-6">

        {/* Top text */}
        <p className="text-gray-600 mb-6">
          Nothing has inspired you? Check out our collections
        </p>

        {/* BIG HEADING */}
        <h2 className="text-3xl md:text-5xl font-light leading-snug mb-10">

          From stylish clothing{" "}
          <Link to="/collections/clothing" className="inline-block align-middle mx-2">
            <img
              src="https://wonder-theme-fashion.myshopify.com/cdn/shop/files/main-column-1.jpg?v=1708418449&width=200"
              alt="Clothing"
              className="inline w-14 h-14 md:w-16 md:h-16 object-cover rounded-full hover:scale-110 transition"
            />
          </Link>

          to premium denim{" "}
          <Link to="/collections/denim" className="inline-block align-middle mx-2">
            <img
              src="https://wonder-theme-fashion.myshopify.com/cdn/shop/files/marynarka.jpg?v=1708205759&width=200"
              alt="Denim"
              className="inline w-14 h-14 md:w-16 md:h-16 object-cover rounded-full hover:scale-110 transition"
            />
          </Link>

          and trendy prints{" "}
          <Link to="/collections/printed" className="inline-block align-middle mx-2">
            <img
              src="https://wonder-theme-fashion.myshopify.com/cdn/shop/files/3-fashion.jpg?v=1698083750&width=200"
              alt="Printed"
              className="inline w-14 h-14 md:w-16 md:h-16 object-cover rounded-full hover:scale-110 transition"
            />
          </Link>

          collections!

        </h2>

        {/* ⭐ BUTTON (MISSING PART) */}
        <Link to="/shop-by-collections">
          <button
            className="
              border border-black 
              px-8 py-3 
              text-sm tracking-widest uppercase
              hover:bg-black hover:text-white 
              transition duration-300
            "
          >
            View all collections
          </button>
        </Link>

      </div>
    </section>
  );
}
