import { Link } from "react-router-dom";

export default function SplitImageVideoSection() {
  return (
    <section className="w-full bg-[#f4f0eb] relative z-10">
      <div className="mx-auto max-w-[1600px] grid grid-cols-1 md:grid-cols-2 min-h-screen">

        {/* LEFT: IMAGE + TEXT */}
        <div className="relative flex items-center justify-start overflow-hidden">
          <img
            src="https://wonder-theme-fashion.myshopify.com/cdn/shop/files/BANNER-wonder.jpg"
            alt="Cosy & Comfort"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Text overlay */}
          <div className="relative z-10 p-10 md:p-20 text-white max-w-md">
            <p className="uppercase tracking-widest text-sm mb-4">
              Most-loved collections
            </p>

            <h2 className="text-4xl md:text-6xl font-light leading-tight mb-8">
              Cosy & <br /> Comfort
            </h2>

            <Link
              to="/collections/fall-into-comfort"
              className="inline-block border border-white px-8 py-3 tracking-wide hover:bg-white hover:text-black transition"
            >
              Discover Now
            </Link>
          </div>

          {/* subtle overlay for readability */}
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* RIGHT: VIDEO */}
        <div className="relative overflow-hidden bg-black">
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="https://wonder-theme-fashion.myshopify.com/cdn/shop/files/preview_images/7358a4723ea6477b94dc41a48278d122.thumbnail.0000000000_600x.jpg"
          >
            <source
              src="https://wonder-theme-fashion.myshopify.com/cdn/shop/videos/c/vp/7358a4723ea6477b94dc41a48278d122/7358a4723ea6477b94dc41a48278d122.HD-1080p-3.3Mbps-9413934.mp4"
              type="video/mp4"
            />
          </video>
        </div>

      </div>
    </section>
  );
}
