import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useRef, useState, useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { GET_INSPIRATION_REELS_PRODUCTS } from "../../api/shopify/InspirationReelsCollection";

import "swiper/css";
import "swiper/css/navigation";

const reelsData = [
  { id: 1, video: "https://wonder-theme-fashion.myshopify.com/cdn/shop/videos/c/vp/b7e7be80f60543bf9adf14277970d2c9/b7e7be80f60543bf9adf14277970d2c9.HD-1080p-2.5Mbps-35679579.mp4" },
  { id: 2, video: "https://wonder-theme-fashion.myshopify.com/cdn/shop/videos/c/vp/6751f232383a4c6ea139f990e7ef7f8a/6751f232383a4c6ea139f990e7ef7f8a.HD-1080p-2.5Mbps-35679580.mp4" },
  { id: 3, video: "https://wonder-theme-fashion.myshopify.com/cdn/shop/videos/c/vp/aef9dcf97db24259809db789affa87a3/aef9dcf97db24259809db789affa87a3.HD-1080p-2.5Mbps-35679578.mp4" },
  { id: 4, video: "https://wonder-theme-fashion.myshopify.com/cdn/shop/videos/c/vp/43b7937c619a4b18b5abb00aedbf8b32/43b7937c619a4b18b5abb00aedbf8b32.HD-1080p-2.5Mbps-35679577.mp4" },
  { id: 5, video: "https://wonder-theme-fashion.myshopify.com/cdn/shop/videos/c/vp/0306f3a88dec4702ae1f0231b5bdbac2/0306f3a88dec4702ae1f0231b5bdbac2.HD-1080p-2.5Mbps-35704677.mp4" },
  { id: 6, video: "https://wonder-theme-fashion.myshopify.com/cdn/shop/videos/c/vp/14f26a880ac04dda9905e50192f7a443/14f26a880ac04dda9905e50192f7a443.HD-1080p-2.5Mbps-35679576.mp4" },
];

export default function InspirationReels() {
  const videoRefs = useRef([]);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperInstanceRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0); 
  const [isMuted, setIsMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const navigate = useNavigate();
  const { data, loading } = useQuery(GET_INSPIRATION_REELS_PRODUCTS);

  const products = data?.collectionByHandle?.products?.edges?.map((e) => e.node) || [];
  
  // Logic to always stay within 0-5 index for dots and products
  const currentIndex = activeIndex % reelsData.length;
  const activeProduct = products[currentIndex];

  const extendedReels = [...reelsData, ...reelsData, ...reelsData];

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      video.muted = isMuted;
      if (i === activeIndex) {
        isPaused ? video.pause() : video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [activeIndex, isMuted, isPaused, isReady]);

  if (loading) return null;

  return (
    <section className="bg-white py-14 md:py-20 relative z-10 overflow-hidden">
      <div className="text-center mb-8 md:mb-12">
        <p className="uppercase tracking-[4px] text-gray-500 text-[10px] md:text-xs font-medium">Tik Tok</p>
        <h2 className="text-3xl md:text-5xl font-light tracking-wide mt-2">INSPIRATION</h2>
      </div>

      <div className="relative w-full max-w-[100vw] h-[550px] md:h-[720px] flex items-center">
        {isReady && (
          <Swiper
            onSwiper={(swiper) => (swiperInstanceRef.current = swiper)}
            modules={[Navigation]}
            centeredSlides={true}
            loop={true}
            initialSlide={reelsData.length}
            loopedSlides={reelsData.length}
            loopAdditionalSlides={reelsData.length}
            speed={600}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            onSlideChange={(swiper) => {
              setActiveIndex(swiper.realIndex);
              setIsPaused(false);
            }}
            breakpoints={{
              0: { slidesPerView: 1.4, spaceBetween: 12 },
              768: { slidesPerView: 2.5, spaceBetween: 20 },
              1024: { slidesPerView: 4.2, spaceBetween: 24 },
            }}
            className="reels-swiper h-full w-full"
          >
            {extendedReels.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <SwiperSlide key={`reel-${index}`} className="flex items-center justify-center">
                  <div 
                    className={`relative w-full transition-all duration-500 ease-in-out bg-black overflow-hidden shadow-lg
                      ${isActive ? "h-[500px] md:h-[680px] z-20 shadow-2xl" : "h-[380px] md:h-[500px] opacity-80"}`}
                  >
                    {isActive && (
                      <>
                        <button onClick={(e) => { e.stopPropagation(); setIsPaused(!isPaused); }} className="absolute top-4 left-4 z-30 p-2 bg-black/20 text-white transition hover:bg-black/40">
                          {isPaused ? <Play size={20} fill="white" /> : <Pause size={20} fill="white" />}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }} className="absolute bottom-4 right-4 z-30 p-2 bg-black/20 text-white transition hover:bg-black/40">
                          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>
                      </>
                    )}

                    <video
                      ref={(el) => (videoRefs.current[index] = el)}
                      playsInline
                      loop
                      muted={isMuted}
                      className="w-full h-full object-cover"
                    >
                      <source src={item.video} type="video/mp4" />
                    </video>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}

        <button ref={prevRef} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:scale-110 transition group">
           <svg className="w-6 h-6 transition-transform group-hover:-translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <button ref={nextRef} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:scale-110 transition group">
           <svg className="w-6 h-6 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>

      <div className="mt-12 flex justify-center px-4">
        {activeProduct && (
          <div
            onClick={() => navigate(`/products/${activeProduct.handle}`)}
            className="shoppable-product-card bg-white w-full max-w-[360px] p-3 md:p-4 flex gap-4 border border-gray-100 shadow-xl cursor-pointer hover:shadow-2xl transition-all duration-300 animate-slideUp"
          >
            <div className="wt-dot__picture bg-gray-50 flex-shrink-0 overflow-hidden">
              <img
                src={activeProduct.featuredImage?.url}
                className="w-16 h-24 md:w-20 md:h-28 object-cover"
                alt={activeProduct.title}
              />
            </div>
            <div className="wt-dot__body flex flex-col justify-center">
              <p className="text-[10px] md:text-[11px] uppercase tracking-widest text-gray-400 font-medium">{activeProduct.vendor}</p>
              <h3 className="text-sm md:text-base font-semibold leading-snug mt-1 text-gray-900">{activeProduct.title}</h3>
              <div className="wt-dot__price mt-2">
                 <span className="text-base md:text-lg font-bold text-black">
                   ₹{Number(activeProduct.priceRange.minVariantPrice.amount).toLocaleString("en-IN")}
                 </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ⭐ FIXED 6 DOTS ONLY - Syncs with original data ⭐ */}
      <div className="mt-10 flex justify-center w-full gap-3">
        {reelsData.map((_, i) => (
          <button
            key={`dot-${i}`}
            onClick={() => swiperInstanceRef.current?.slideToLoop(i)}
            className={`transition-all duration-400 h-2 rounded-full cursor-pointer ${
              currentIndex === i ? "bg-black w-7" : "bg-gray-200 w-2"
            }`}
          />
        ))}
      </div>

      <style>{`
        .reels-swiper .swiper-wrapper { display: flex; align-items: center; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slideUp { animation: slideUp 0.5s ease-out forwards; }
      `}</style>
    </section>
  );
}