import { Link } from "react-router-dom";

export default function FeaturedCollections() {
  return (
    <section className="w-full">
      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 w-full">

        {/* ================= VIDEO CARD ================= */}
        <Link to="/collections/blazer" className="relative h-[70vh] md:h-[85vh] overflow-hidden group">

          {/* VIDEO BACKGROUND */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster="//wonder-theme-fashion.myshopify.com/cdn/shop/files/preview_images/3efd7254a464405a81cc493e8dc94b06.thumbnail.0000000000_600x.jpg?v=1754863191"
          >
            <source
              src="//wonder-theme-fashion.myshopify.com/cdn/shop/videos/c/vp/3efd7254a464405a81cc493e8dc94b06/3efd7254a464405a81cc493e8dc94b06.HD-720p-4.5Mbps-54641207.mp4?v=0"
              type="video/mp4"
            />
          </video>

          {/* DARK OVERLAY */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />

          {/* TEXT */}
          <div className="absolute bottom-12 left-0 right-0 text-center text-white px-4">
            <h2 className="text-2xl md:text-4xl font-semibold mb-6">
              MOE Collection
            </h2>

            <span className="border-b border-white pb-1 text-sm md:text-base tracking-wide">
              Shop the Collection
            </span>
          </div>
        </Link>

        {/* ================= IMAGE CARD ================= */}
        <Link to="/collections/bags" className="relative h-[70vh] md:h-[85vh] overflow-hidden group">

          {/* IMAGE BACKGROUND */}
          <img
            src="//wonder-theme-fashion.myshopify.com/cdn/shop/files/rylko-bags-desktop-9c.jpg?v=1755172700&width=3840"
            alt="Bags Collection"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* DARK OVERLAY */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />

          {/* TEXT */}
          <div className="absolute bottom-12 left-0 right-0 text-center text-white px-4">
            <h2 className="text-2xl md:text-4xl font-semibold mb-6">
              New Bags
            </h2>

            <span className="border-b border-white pb-1 text-sm md:text-base tracking-wide">
              Shop New Arrivals
            </span>
          </div>
        </Link>

      </div>
    </section>
  );
}
