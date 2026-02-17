export default function InstagramSection() {
  const images = [
    "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/insta-14.jpg",
    "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/office-nife.jpg",
    "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/insta-image-2.jpg",
    "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/velour-grid-view-desktop-25-1.jpg",
    "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/insta-image-3.jpg",
    "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/insta-image.jpg",
    "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/rylko-bags-desktop-4.jpg",
  ];

  return (
    <section className="bg-white py-16 lg:py-20 overflow-hidden relative z-10">

      {/* JOIN US TEXT */}
      <div className="text-center mb-10 lg:mb-14">
        <p className="uppercase tracking-[3px] text-[13px] text-gray-500 mb-2">
          Join us
        </p>
        <h2 className="text-[32px] lg:text-[42px] font-light tracking-wide">
          @velourfashion
        </h2>
      </div>

      {/* MARQUEE */}
      <div className="relative overflow-hidden group">
        <div className="flex gap-[4px] animate-brand-marquee group-hover:[animation-play-state:paused]">
          {[...images, ...images].map((img, i) => (
            <img
              key={i}
              src={img}
              alt=""
              className="h-[200px] lg:h-[360px] w-auto object-cover"
            />
          ))}
        </div>
      </div>

      {/* FOLLOW BUTTON */}
      <div className="text-center mt-10 lg:mt-12">
        <button className="border-b border-black text-[15px] font-medium pb-1 hover:opacity-70">
          Follow Us
        </button>
      </div>

    </section>
  );
}
