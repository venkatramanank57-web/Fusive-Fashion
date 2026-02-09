import { Link } from "react-router-dom";

export default function SalePromoSplit() {
  return (
    <section className="w-full grid md:grid-cols-2">

      {/* LEFT SIDE */}
      <PromoSide
        image="https://wonder-theme-fashion.myshopify.com/cdn/shop/files/sale-image-desktop.webp"
        title="30% OFF"
        subtitle="SHIRTS"
        link="/collections/shirts"
        textColor="text-black"
      />

      {/* RIGHT SIDE */}
      <PromoSide
        image="https://wonder-theme-fashion.myshopify.com/cdn/shop/files/sale-image-3-desktop.jpg"
        title="25% OFF"
        subtitle="TROUSERS"
        link="/collections/trousers"
        textColor="text-white"
      />

    </section>
  );
}

/* ---------------------------------- */
/* Side Banner */
/* ---------------------------------- */
function PromoSide({ image, title, subtitle, link, textColor }) {
  return (
    <Link to={link} className="relative block group z-10">

      {/* IMAGE */}
      <div className="h-[320px] md:h-[520px] overflow-hidden">
        <img
          src={image}
          alt={subtitle}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
        />
      </div>

      {/* TEXT OVER IMAGE */}
      <div
        className={`absolute bottom-10 left-10 ${textColor}`}
      >
        <h3 className="text-3xl md:text-5xl font-light leading-tight tracking-wide">
          {title} <br /> {subtitle}
        </h3>

        <span className="inline-block mt-4 text-sm border-b border-current pb-1">
          Check now
        </span>
      </div>
    </Link>
  );
}
