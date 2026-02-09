import { Link } from "react-router-dom";

export default function LookbookMasonry() {
  const looks = [
    {
      img: "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/main-column-3.jpg?v=1708418480&width=1200",
      link: "/products/a-detachable-dress-at-the-waist-with-pleats",
      alt: "Detachable dress"
    },
    {
      img: "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/office-nife-2.jpg?v=1708375052&width=1200",
      link: "/products/casual-dress",
      alt: "Casual dress"
    },
    {
      img: "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/soft-office-desktop.jpg?v=1708375742&width=1200",
      link: "/products/a-detachable-dress-at-the-waist-with-pleats",
      alt: "Office look"
    },
    {
      img: "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/lady-mobile.jpg?v=1711572651&width=1200",
      link: "/products/copy-of-fitted-dress-with-long-sleeves",
      alt: "Lady fashion"
    },
    {
      img: "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/6b-fashion.jpg?v=1698087992&width=1200",
      link: "/products/flared-red-skirt-midi",
      alt: "Red skirt"
    },
    {
      img: "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/sale-6-fashion.jpg?v=1698087767&width=1200",
      link: "/products/flared-dress-with-an-envelope-neckline",
      alt: "Sale fashion"
    },
    {
      img: "https://wonder-theme-fashion.myshopify.com/cdn/shop/products/cm3588-odcinana-sukienka-w-pasie-z-zakladkami-bezowa.webp?v=1666801032&width=1200",
      link: "/products/a-detachable-dress-at-the-waist-with-pleats",
      alt: "White dress"
    },
    {
      img: "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/banner-grid-view-2.jpg?v=1703025443&width=1200",
      link: "/products/short-straight-blazer",
      alt: "Blazer"
    },
    {
      img: "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/main-column-2.jpg?v=1708418465&width=1200",
      link: "/products/doublebreasted-blazer",
      alt: "Double blazer"
    },
    {
      img: "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/marynarka.jpg?v=1708205759&width=1200",
      link: "/products/single-row-jacket",
      alt: "Jacket"
    },
    {
      img: "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/sale-fashion-ver2.jpg?v=1698088452&width=1200",
      link: "/products/fitted-green-trousers",
      alt: "Trousers"
    },
    {
      img: "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/main-column-1.jpg?v=1708418449&width=1200",
      link: "/products/flared-dress-with-an-envelope-neckline",
      alt: "Dress"
    },
    {
      img: "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/3-fashion.jpg?v=1698083750&width=1200",
      link: "/products/black-blazer-with-roll-up-sleeves",
      alt: "Black blazer"
    },
    {
      img: "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/2-fashion.jpg?v=1698083750&width=1200",
      link: "/products/short-jacket-in-pepit",
      alt: "Short jacket"
    },
    {
      img: "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/wonder-blazer-nife-2-2024.jpg?v=1726067324&width=1200",
      link: "/products/caramel-palazzo-pants",
      alt: "Palazzo"
    }
  ];

  // ⭐ height variation → masonry feel
  const getHeightClass = (index) => {
    const tall = [3, 6, 14];
    const medium = [0, 5, 8, 10, 11, 12, 13];

    if (tall.includes(index)) return "h-[520px]";
    if (medium.includes(index)) return "h-[430px]";
    return "h-[360px]";
  };

  return (
    <section className="w-full pt-2 pb-1">

      {/* ⭐ FULL WIDTH MASONRY */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-[6px] px-[6px]">

        {looks.map((item, index) => (
          <Link
            key={index}
            to={item.link}
            className={`block mb-[6px] break-inside-avoid overflow-hidden group ${getHeightClass(index)}`}
          >
            <img
              src={item.img}
              alt={item.alt}
              className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
              loading="lazy"
            />
          </Link>
        ))}

      </div>
    </section>
  );
}
