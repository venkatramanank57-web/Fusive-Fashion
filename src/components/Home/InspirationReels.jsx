import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useRef, useState, useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { GET_INSPIRATION_REELS_PRODUCTS } from "../../api/shopify/InspirationReelsCollection";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

/* =========================
   VIDEOS ONLY (UNCHANGED)
========================= */
const reelsData = [
  {
    id: 1,
    label: "Classic black pants",
    poster:
      "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/preview_images/b7e7be80f60543bf9adf14277970d2c9.thumbnail.0000000000_600x.jpg?v=1727814424",
    video:
      "https://wonder-theme-fashion.myshopify.com/cdn/shop/videos/c/vp/b7e7be80f60543bf9adf14277970d2c9/b7e7be80f60543bf9adf14277970d2c9.HD-1080p-2.5Mbps-35679579.mp4",
  },
  {
    id: 2,
    label: "Detachable pleated waist",
    poster:
      "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/preview_images/6751f232383a4c6ea139f990e7ef7f8a.thumbnail.0000000000_600x.jpg?v=1727814418",
    video:
      "https://wonder-theme-fashion.myshopify.com/cdn/shop/videos/c/vp/6751f232383a4c6ea139f990e7ef7f8a/6751f232383a4c6ea139f990e7ef7f8a.HD-1080p-2.5Mbps-35679580.mp4",
  },
  {
    id: 3,
    label: "One shoulder dress",
    poster:
      "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/preview_images/aef9dcf97db24259809db789affa87a3.thumbnail.0000000000_600x.jpg?v=1727814418",
    video:
      "https://wonder-theme-fashion.myshopify.com/cdn/shop/videos/c/vp/aef9dcf97db24259809db789affa87a3/aef9dcf97db24259809db789affa87a3.HD-1080p-2.5Mbps-35679578.mp4",
  },
  {
    id: 4,
    label: "Dress",
    poster:
      "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/preview_images/43b7937c619a4b18b5abb00aedbf8b32.thumbnail.0000000000_600x.jpg?v=1727814418",
    video:
      "https://wonder-theme-fashion.myshopify.com/cdn/shop/videos/c/vp/43b7937c619a4b18b5abb00aedbf8b32/43b7937c619a4b18b5abb00aedbf8b32.HD-1080p-2.5Mbps-35679577.mp4",
  },
  {
    id: 5,
    label: "Classic checkered blazer",
    poster:
      "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/preview_images/0306f3a88dec4702ae1f0231b5bdbac2.thumbnail.0000000000_600x.jpg?v=1727861116",
    video:
      "https://wonder-theme-fashion.myshopify.com/cdn/shop/videos/c/vp/0306f3a88dec4702ae1f0231b5bdbac2/0306f3a88dec4702ae1f0231b5bdbac2.HD-1080p-2.5Mbps-35704677.mp4",
  },
  {
    id: 6,
    label: "Flared skirt",
    poster:
      "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/preview_images/14f26a880ac04dda9905e50192f7a443.thumbnail.0000000000_600x.jpg?v=1727814418",
    video:
      "https://wonder-theme-fashion.myshopify.com/cdn/shop/videos/c/vp/14f26a880ac04dda9905e50192f7a443/14f26a880ac04dda9905e50192f7a443.HD-1080p-2.5Mbps-35679576.mp4",
  },
  {
    id: 7,
    label: "Classic black pants",
    poster:
      "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/preview_images/b7e7be80f60543bf9adf14277970d2c9.thumbnail.0000000000_600x.jpg?v=1727814424",
    video:
      "https://wonder-theme-fashion.myshopify.com/cdn/shop/videos/c/vp/b7e7be80f60543bf9adf14277970d2c9/b7e7be80f60543bf9adf14277970d2c9.HD-1080p-2.5Mbps-35679579.mp4",
  },
];

export default function InspirationReels() {
  const videoRefs = useRef([]);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const paginationRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);

  const navigate = useNavigate();
  const { data, loading, error } = useQuery(GET_INSPIRATION_REELS_PRODUCTS);

  const products =
    data?.collectionByHandle?.products?.edges?.map((e) => e.node) || [];
  const activeProduct = products[activeIndex];

  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      video.muted = muted;
      if (i === activeIndex) paused ? video.pause() : video.play();
      else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [activeIndex, muted, paused]);

  return (
    <section className="bg-[#f5f5f5] py-20 relative z-10">
      <div className="text-center mb-14">
        <p className="uppercase tracking-[4px] text-gray-500 text-sm">
          Tik Tok
        </p>
        <h2 className="text-4xl font-light tracking-wide mt-3">INSPIRATION</h2>
      </div>

      <div className="relative w-full overflow-hidden px-1 md:px-2">
        <Swiper
          modules={[Navigation, Pagination]}
          centeredSlides
          loop
          speed={600}
          watchSlidesProgress
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.params.pagination.el = paginationRef.current;
          }}
          pagination={{ clickable: true, el: paginationRef.current }}
          navigation
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.realIndex);
            setPaused(false);
          }}
          breakpoints={{
            0: { slidesPerView: 1.3, spaceBetween: 16 },
            768: { slidesPerView: 2.5, spaceBetween: 16 },
            1024: { slidesPerView: 4.2, spaceBetween: 12 },
          }}
        >
          {reelsData.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <SwiperSlide key={item.id}>
                <div
                  className={`relative ${isActive ? "scale-100" : "scale-[0.9]"}`}
                >
                  <video
                    ref={(el) => (videoRefs.current[index] = el)}
                    playsInline
                    loop
                    className="w-full h-[720px] object-cover"
                  >
                    <source src={item.video} type="video/mp4" />
                  </video>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        <button
          ref={prevRef}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white shadow flex items-center justify-center"
        >
          ‹
        </button>

        <button
          ref={nextRef}
          className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white shadow flex items-center justify-center"
        >
          ›
        </button>
      </div>

      {/* REAL SHOPIFY PRODUCT CARD */}
      <div className="mt-2 flex justify-center">
        {activeProduct && (
          <div
            onClick={() => navigate(`/products/${activeProduct.handle}`)}
            className="bg-white w-[270px] md:w-[353px] p-2.5 md:p-4 flex gap-2.5 md:gap-4 border cursor-pointer hover:shadow-lg transition"
          >
            {/* IMAGE */}
            <div className="border p-1">
              <img
                src={activeProduct.featuredImage?.url}
                className="w-12 h-18 md:w-16 md:h-24 object-cover"
                alt={activeProduct.title}
              />
            </div>

            {/* TEXT */}
            <div>
              <p className="text-[11px] md:text-sm text-gray-400">
                {activeProduct.vendor}
              </p>

              <p className="text-xs md:text-base font-medium leading-tight">
                {activeProduct.title}
              </p>

              <p className="text-xs md:text-base mt-1 font-medium">
                ₹
                {Number(
                  activeProduct.priceRange.minVariantPrice.amount,
                ).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="pb-3 flex justify-center">
        <div ref={paginationRef} className="swiper-pagination" />
      </div>
    </section>
  );
}
