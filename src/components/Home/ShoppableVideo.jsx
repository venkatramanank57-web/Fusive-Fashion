import { useRef, useState, useEffect } from "react";
import { Play, Pause, ChevronRight, ShoppingBag, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { useDispatch } from "react-redux";
import { GET_HOME_SHOPPABLE_PRODUCTS } from "../../api/shopify/HomeShoppableCollectionProducts";
import { addToCart } from "../../features/cart/cartSlice";

export default function ShoppableVideo() {
  const videoRef = useRef(null);
  const dispatch = useDispatch();
  const [isPlaying, setIsPlaying] = useState(true);
  const [visibleCards, setVisibleCards] = useState(1);

  /* SHOPIFY PRODUCTS */
  const { data, loading } = useQuery(GET_HOME_SHOPPABLE_PRODUCTS);

  const products =
    data?.collectionByHandle?.products?.edges?.map(({ node }) => ({
      id: node.id,
      title: node.title,
      handle: node.handle,
      vendor: node.vendor,
      image: node.featuredImage?.url,
      price: Number(node.priceRange.minVariantPrice.amount),
      variantId: node.variants.edges[0]?.node?.id,
    })) || [];

  /* PLAY / PAUSE VIDEO */
  const toggleVideo = () => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.paused ? vid.play() : vid.pause();
    setIsPlaying(!vid.paused);
  };

  /* ADD TO CART */
  const handleAddToCart = (e, product) => {
    e.preventDefault();
    dispatch(
      addToCart({
        productId: product.id,
        variantId: product.variantId,
        title: product.title,
        price: product.price,
        quantity: 1,
        image: product.image,
        handle: product.handle,
      })
    );
  };

  /* NEXT CARD */
  const showNextCard = () => {
    setVisibleCards((prev) => (prev < products.length ? prev + 1 : prev));
  };

  /* PREVIOUS CARD */
  const showPreviousCard = () => {
    setVisibleCards((prev) => (prev > 1 ? prev - 1 : prev));
  };

  /* AUTO REVEAL */
  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCards((prev) => (prev < products.length ? prev + 1 : prev));
    }, 4000);
    return () => clearInterval(interval);
  }, [products.length]);

  if (loading) return null;

  return (
    <section className="relative w-full h-[520px] md:h-[760px] overflow-hidden z-10">

      {/* VIDEO */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src="//wonder-theme-fashion.myshopify.com/cdn/shop/videos/c/vp/cb71f93f95a94b7e9d069d767db8ba2a/cb71f93f95a94b7e9d069d767db8ba2a.HD-1080p-7.2Mbps-24784977.mp4"
      />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/20" />

      {/* PLAY BUTTON */}
      <button
        onClick={toggleVideo}
        className="absolute top-6 left-6 bg-white/90 backdrop-blur p-3 rounded-full shadow-lg z-10"
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
      </button>

      {/* PRODUCT CARDS */}
      <div className="absolute bottom-6 right-4 md:right-10 flex gap-4 md:gap-5">

        {products.slice(0, visibleCards).map((p, i) => (
          <Link key={p.id} to={`/products/${p.handle}`}>
            <div className="relative bg-white 
              w-[300px] sm:w-[320px] md:w-[420px]
              h-[130px] sm:h-[140px] md:h-[160px]
              shadow-2xl flex items-center px-4 md:px-6 animate-fadeIn">

              {/* IMAGE */}
              <img
                src={p.image}
                alt={p.title}
                className="w-16 sm:w-20 md:w-24 object-contain"
              />

              {/* TEXT AREA (FIXED 🔥) */}
              <div className="ml-4 md:ml-6 pr-16 md:pr-20">
                <p className="text-[10px] sm:text-xs tracking-widest text-gray-500 mb-1 line-clamp-1">
                  {p.vendor}
                </p>

                <p className="text-sm sm:text-base md:text-xl font-medium leading-tight line-clamp-2 mb-1">
                  {p.title}
                </p>

                <p className="text-sm md:text-lg font-semibold">
                  ₹{p.price.toLocaleString("en-IN")}
                </p>
              </div>

              {/* ICON COLUMN */}
              <div className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 md:gap-4">

                {/* ADD TO CART */}
                <button
                  onClick={(e) => handleAddToCart(e, p)}
                  className="group w-9 h-9 md:w-10 md:h-10 bg-white hover:bg-black transition flex items-center justify-center shadow"
                >
                  <ShoppingBag
                    size={18}
                    className="text-black group-hover:text-white transition"
                  />
                </button>

                {/* NAVIGATION BUTTONS */}
                {i === visibleCards - 1 && (
                  <div className="flex flex-col gap-2">
                    {/* PREVIOUS BUTTON - Show if not on first card */}
                    {visibleCards > 1 && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          showPreviousCard();
                        }}
                        className="group w-9 h-9 md:w-10 md:h-10 bg-white hover:bg-black transition flex items-center justify-center shadow rotate-180"
                      >
                        <ChevronRight
                          size={18}
                          className="text-black group-hover:text-white transition"
                        />
                      </button>
                    )}
                    
                    {/* NEXT BUTTON - Always show if there are more cards */}
                    {visibleCards < products.length && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          showNextCard();
                        }}
                        className="group w-9 h-9 md:w-10 md:h-10 bg-white hover:bg-black transition flex items-center justify-center shadow"
                      >
                        <ChevronRight
                          size={18}
                          className="text-black group-hover:text-white transition"
                        />
                      </button>
                    )}
                  </div>
                )}

              </div>
            </div>
          </Link>
        ))}

      </div>
    </section>
  );
}