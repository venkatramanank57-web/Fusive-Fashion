const brands = [
  {
    id: 1,
    img: "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/Untitled-9.jpg",
  },
  {
    id: 2,
    img: "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/lalupa.jpg",
  },
  {
    id: 3,
    img: "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/nife.jpg",
  },
  {
    id: 4,
    img: "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/lenitif.jpg",
  },
  {
    id: 5,
    img: "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/figl.jpg",
  },
  {
    id: 6,
    img: "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/lanti.jpg",
  },
];

export default function BrandsMarquee({
  title,
  subtitle,
  showHeading = false,
}) {
  const loopBrands = [...brands, ...brands, ...brands, ...brands];

  return (
    <section
      className="bg-white py-16 overflow-hidden relative z-10
      before:absolute before:left-0 before:top-0 before:w-40 before:h-full 
      before:bg-gradient-to-r before:from-white before:to-transparent before:z-10
      after:absolute after:right-0 after:top-0 after:w-40 after:h-full 
      after:bg-gradient-to-l after:from-white after:to-transparent after:z-10"
    >
      <div className="max-w-[1400px] mx-auto px-6">
        {/* ⭐ OPTIONAL HEADING */}
        {showHeading && (
          <div className="text-center mb-14">
            {subtitle && <p className="text-gray-500 mb-3">{subtitle}</p>}
            {title && (
              <h2 className="text-3xl md:text-4xl font-light">{title}</h2>
            )}
          </div>
        )}

        {/* ⭐ MARQUEE */}
        {/* MARQUEE */}
        <div className="overflow-hidden group">
          <div className="flex gap-24 w-max animate-brand-marquee group-hover:[animation-play-state:paused]">
            {loopBrands.map((brand, i) => (
              <BrandItem key={i} img={brand.img} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BrandItem({ img }) {
  return (
    <div className="w-[170px] h-[140px] flex items-center justify-center shrink-0">
      <img
        src={img}
        alt="brand"
        loading="eager"
        className="
          max-w-full max-h-full object-contain
          grayscale opacity-70
          hover:grayscale-0 hover:opacity-100
          transition duration-300
        "
      />
    </div>
  );
}
