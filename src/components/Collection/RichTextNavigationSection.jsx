import { Link, useParams } from "react-router-dom";

const categories = [
  { name: "View All", link: "/collections/clothing", handle: "clothing" },
  { name: "Denim", link: "/collections/denim", handle: "denim" },
  { name: "Printed", link: "/collections/printed", handle: "printed" },
  { name: "Solids", link: "/collections/solids", handle: "solids" },
  { name: "Bodycon", link: "/collections/bodycon", handle: "bodycon" },
];

export default function RichTextNavigationSection() {
  const { handle } = useParams(); // ⭐ current collection

  return (
    <section className="bg-white pt-10 pb-14 relative z-10">

      {/* TEXT PART */}
      <div className="text-center px-6 mb-10">
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

          {categories.map((cat, i) => {
            const isActive = handle === cat.handle;

            return (
              <Link
                key={i}
                to={cat.link}
                className={`
                  px-6 py-3 text-sm tracking-wide transition border
                  ${
                    isActive
                      ? "bg-gray-100 text-gray-400 border-gray-200 pointer-events-none cursor-default"
                      : "border-gray-300 hover:bg-black hover:text-white"
                  }
                `}
              >
                {cat.name}
              </Link>
            );
          })}

        </div>
      </div>

    </section>
  );
}
