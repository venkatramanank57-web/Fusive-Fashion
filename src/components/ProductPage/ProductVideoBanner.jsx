import { useRef, useState } from "react";

export default function VideoBannerSection() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const toggleVideo = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section className="relative w-full h-[480px] md:h-[600px] overflow-hidden z-10">

      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster="https://wonder-theme-fashion.myshopify.com/cdn/shop/files/preview_images/a52fd1625cc74dd7a7ee25f5d89de863.thumbnail.0000000000_600x.jpg"
      >
        <source
          src="https://wonder-theme-fashion.myshopify.com/cdn/shop/videos/c/vp/a52fd1625cc74dd7a7ee25f5d89de863/a52fd1625cc74dd7a7ee25f5d89de863.HD-1080p-4.8Mbps-9159344.mp4"
          type="video/mp4"
        />
      </video>

      {/* Play / Pause Button (TOP LEFT) */}
      <button
        onClick={toggleVideo}
        className="absolute top-6 left-6 z-20 backdrop-blur-md bg-white/20 hover:bg-white/30 border border-white/30 p-3 rounded-md text-white transition"
        aria-label="Play/Pause video"
      >
        {isPlaying ? (
          // PAUSE ICON
          <svg viewBox="0 0 512 512" width="22" height="22">
            <g fill="white">
              <path d="M224 435.8V76.1c0-6.7-5.4-12.1-12.2-12.1h-71.6c-6.8 0-12.2 5.4-12.2 12.1v359.7c0 6.7 5.4 12.2 12.2 12.2h71.6c6.6 0 12.2-5.4 12.2-12.2z"/>
              <path d="M371.8 64h-71.6c-6.7 0-12.2 5.4-12.2 12.1v359.7c0 6.7 5.4 12.2 12.2 12.2h71.6c6.7 0 12.2-5.4 12.2-12.2V76.1c0-6.7-5.5-12.1-12.2-12.1z"/>
            </g>
          </svg>
        ) : (
          // PLAY ICON
          <svg viewBox="0 0 10 14" width="18" height="18" fill="white">
            <path d="M1.48 0.81C0.81 0.45 0 0.93 0 1.69v10.52c0 .78.86 1.26 1.53.85L10.54 7.5c.65-.4.63-1.36-.04-1.73L1.48.81z"/>
          </svg>
        )}
      </button>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Text Overlay */}
      <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
        <div className="max-w-3xl text-white">
          <p className="uppercase tracking-widest text-sm mb-4">
            Sustainability
          </p>

          <h2 className="text-2xl md:text-4xl lg:text-5xl font-light leading-snug">
            Our fabrics are developed specifically for us and we only produce
            quality apparel that lasts.
          </h2>
        </div>
      </div>
    </section>
  );
}
