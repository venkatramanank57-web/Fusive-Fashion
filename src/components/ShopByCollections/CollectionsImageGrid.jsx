import { Link } from "react-router-dom";

export default function CollectionsImageGrid() {

  const collections = [
    {
      title: "Denim",
      path: "/collections/denim",
      img: "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/1-fashion.jpg?v=1698083750"
    },
    {
      title: "Printed",
      path: "/collections/Printed",
      img: "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/2-fashion.jpg?v=1698083750"
    },
    {
      title: "Solids",
      path: "/collections/Solids",
      img: "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/3-fashion.jpg?v=1698083750"
    },
    {
      title: "Bodycon",
      path: "/collections/bodycon",
      img: "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/4-fashion.jpg?v=1698086261"
    },
    {
      title: "New-arrivals",
      path: "collections/new-arrivals",
      img: "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/6b-fashion.jpg?v=1698087992"
    },
    {
      title: "Sale %",
      path: "/collections/sale",
      img: "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/sale-x4-fashion.jpg?v=1698088943"
    }
  ];

  return (
    <section className="w-full">

      <div className="grid md:grid-cols-3">

        {collections.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="group relative h-[420px] md:h-[520px] overflow-hidden"
          >
            {/* IMAGE */}
            <img
              src={item.img}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition" />

            {/* TEXT */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
              <h2 className="text-2xl md:text-3xl font-light mb-4">
                {item.title}
              </h2>

              <span className="border-b border-white text-sm tracking-wider">
                View all
              </span>
            </div>

          </Link>
        ))}

      </div>

    </section>
  );
}
