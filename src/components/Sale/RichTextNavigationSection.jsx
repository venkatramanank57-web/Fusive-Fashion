import { Link } from "react-router-dom";

const categories = [
  { name: "View All", link: "/collections/clothing" },
  { name: "Denim", link: "/collections/denim" },
  { name: "Printed", link: "/collections/printed" },
  { name: "Solids", link: "/collections/solids" },
  { name: "Bodycon", link: "/collections/bodycon" },
];

export default function RichTextNavigationSection() {
  return (
    <section className="bg-white pt-10 pb-14  relative z-10">

      {/* TEXT PART */}
      <div className="text-center px-6 mb-10 ">
        <p className="text-gray-600 mb-3">
          Didn’t find the one?
        </p>

        <h2 className="text-2xl md:text-3xl font-light">
          Fashion has more to show you
        </h2>
      </div>

      {/* CATEGORY NAV */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">

          {categories.map((cat, i) => (
            <Link
              key={i}
              to={cat.link}
              className="
                border border-gray-300 
                px-6 py-3 
                text-sm tracking-wide 
                hover:bg-black hover:text-white 
                transition
              "
            >
              {cat.name}
            </Link>
          ))}

        </div>
      </div>

    </section>
  );
}
