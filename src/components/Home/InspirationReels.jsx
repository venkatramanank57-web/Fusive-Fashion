import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useRef, useState, useEffect } from "react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const reelsData = [
  {
    id: 1,
    label: "Classic black pants",
    poster:
      "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/preview_images/b7e7be80f60543bf9adf14277970d2c9.thumbnail.0000000000_600x.jpg?v=1727814424",
    video:
      "https://wonder-theme-fashion.myshopify.com/cdn/shop/videos/c/vp/b7e7be80f60543bf9adf14277970d2c9/b7e7be80f60543bf9adf14277970d2c9.HD-1080p-2.5Mbps-35679579.mp4",
    productImg:
      "https://cdn.shopify.com/s/files/1/0000/0001/products/6.jpg",
    brand: "NIFE",
    title: "Classic black pants",
    price: "Rs. 6,500.00",
  },
  {
    id: 2,
    label: "Detachable pleated waist",
    poster:
      "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/preview_images/6751f232383a4c6ea139f990e7ef7f8a.thumbnail.0000000000_600x.jpg?v=1727814418",
    video:
      "https://wonder-theme-fashion.myshopify.com/cdn/shop/videos/c/vp/6751f232383a4c6ea139f990e7ef7f8a/6751f232383a4c6ea139f990e7ef7f8a.HD-1080p-2.5Mbps-35679580.mp4",
    productImg:
      "https://cdn.shopify.com/s/files/1/0000/0001/products/12.jpg",
    brand: "MOE",
    title: "Detachable pleated waist dress",
    price: "Rs. 6,100.00",
  },
  {
    id: 3,
    label: "One shoulder dress",
    poster:
      "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/preview_images/aef9dcf97db24259809db789affa87a3.thumbnail.0000000000_600x.jpg?v=1727814418",
    video:
      "https://wonder-theme-fashion.myshopify.com/cdn/shop/videos/c/vp/aef9dcf97db24259809db789affa87a3/aef9dcf97db24259809db789affa87a3.HD-1080p-2.5Mbps-35679578.mp4",
    productImg:
      "https://cdn.shopify.com/s/files/1/0000/0001/products/1.jpg",
    brand: "MAKOVER",
    title: "One shoulder dress",
    price: "Rs. 8,400.00",
  },
  {
    id: 4,
    label: "Dress",
    poster:
      "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/preview_images/43b7937c619a4b18b5abb00aedbf8b32.thumbnail.0000000000_600x.jpg?v=1727814418",
    video:
      "https://wonder-theme-fashion.myshopify.com/cdn/shop/videos/c/vp/43b7937c619a4b18b5abb00aedbf8b32/43b7937c619a4b18b5abb00aedbf8b32.HD-1080p-2.5Mbps-35679577.mp4",
    productImg:
      "https://cdn.shopify.com/s/files/1/0000/0001/products/2.jpg",
    brand: "MOE",
    title: "Elegant beige dress",
    price: "Rs. 6,100.00",
  },
  {
    id: 5,
    label: "Classic checkered blazer",
    poster:
      "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/preview_images/0306f3a88dec4702ae1f0231b5bdbac2.thumbnail.0000000000_600x.jpg?v=1727861116",
    video:
      "https://wonder-theme-fashion.myshopify.com/cdn/shop/videos/c/vp/0306f3a88dec4702ae1f0231b5bdbac2/0306f3a88dec4702ae1f0231b5bdbac2.HD-1080p-2.5Mbps-35704677.mp4",
    productImg:
      "https://cdn.shopify.com/s/files/1/0000/0001/products/3.jpg",
    brand: "NIFE",
    title: "Classic checkered blazer",
    price: "Rs. 9,200.00",
  },
  {
    id: 6,
    label: "Flared skirt",
    poster:
      "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/preview_images/14f26a880ac04dda9905e50192f7a443.thumbnail.0000000000_600x.jpg?v=1727814418",
    video:
      "https://wonder-theme-fashion.myshopify.com/cdn/shop/videos/c/vp/14f26a880ac04dda9905e50192f7a443/14f26a880ac04dda9905e50192f7a443.HD-1080p-2.5Mbps-35679576.mp4",
    productImg:
      "https://cdn.shopify.com/s/files/1/0000/0001/products/5.jpg",
    brand: "NIFE",
    title: "Flared skirt",
    price: "Rs. 7,000.00",
  },
  {
    id: 7,
    label: "Classic black pants",
    poster:
      "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/preview_images/b7e7be80f60543bf9adf14277970d2c9.thumbnail.0000000000_600x.jpg?v=1727814424",
    video:
      "https://wonder-theme-fashion.myshopify.com/cdn/shop/videos/c/vp/b7e7be80f60543bf9adf14277970d2c9/b7e7be80f60543bf9adf14277970d2c9.HD-1080p-2.5Mbps-35679579.mp4",
    productImg:
      "https://cdn.shopify.com/s/files/1/0000/0001/products/6.jpg",
    brand: "NIFE",
    title: "Classic black pants",
    price: "Rs. 6,500.00",
  },
];


export default function InspirationReels() {
  const videoRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;

      video.muted = muted;

      if (i === activeIndex) {
        paused ? video.pause() : video.play();
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [activeIndex, muted, paused]);

  const activeItem = reelsData[activeIndex];

  return (
    <section className="bg-white py-12">
      {/* TITLE */}
      <div className="text-center mb-6">
        <p className="uppercase tracking-[4px] text-gray-400 text-xs">
          Tik Tok
        </p>
        <h2 className="text-3xl font-light tracking-wide mt-2">
          INSPIRATION
        </h2>
      </div>

      {/* REELS */}
      <Swiper
        modules={[Navigation, Pagination]}
        centeredSlides
        loop
        speed={500}
        pagination={{ clickable: true }}
        breakpoints={{
          0: {
            slidesPerView: 1.05,
            spaceBetween: 12,
          },
          768: {
            slidesPerView: 2.2,
            spaceBetween: 12,
          },
          1024: {
            slidesPerView: 4.2,
            spaceBetween: 12,
          },
        }}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.realIndex);
          setPaused(false);
        }}
      >
        {reelsData.map((item, index) => (
          <SwiperSlide key={item.id}>
            <div className="relative">
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                playsInline
                loop
                className="w-full aspect-[9/16] object-cover rounded-md"
              >
                <source src={item.video} type="video/mp4" />
                <img src={item.poster} alt="" />
              </video>

              {/* PLAY / PAUSE */}
              {index === activeIndex && (
                <>
                  <button
                    onClick={() => setPaused((p) => !p)}
                    className="absolute top-3 left-3 bg-black/60 text-white w-8 h-8 flex items-center justify-center text-xs rounded"
                  >
                    {paused ? "▶" : "❚❚"}
                  </button>

                  <button
                    onClick={() => setMuted((m) => !m)}
                    className="absolute bottom-3 right-3 bg-black/60 text-white w-8 h-8 flex items-center justify-center text-xs rounded"
                  >
                    {muted ? "🔇" : "🔊"}
                  </button>
                </>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* PRODUCT CARD */}
      <div className="mt-6 flex justify-center">
        <div className="bg-white w-[90%] max-w-[360px] p-4 flex gap-4 border shadow-sm">
          <img
            src={activeItem.productImg}
            className="w-14 h-20 object-cover"
            alt=""
          />
          <div>
            <p className="text-xs text-gray-400">{activeItem.brand}</p>
            <p className="text-sm font-medium leading-tight">
              {activeItem.title}
            </p>
            <p className="text-sm mt-1">{activeItem.price}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
