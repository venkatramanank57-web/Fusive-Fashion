import { useRef, useState, useEffect } from "react";
import { Play, Pause, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { useDispatch } from "react-redux";
import { GET_HOME_SHOPPABLE_PRODUCTS } from "../../api/shopify/HomeShoppableCollectionProducts";
import { addToCart } from "../../features/cart/cartSlice";

export default function ShoppableVideo() {
  const videoRef = useRef(null);
  const dispatch = useDispatch();

  const [isPlaying, setIsPlaying] = useState(true);
  const [visibleCount, setVisibleCount] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const scrollRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showIndicator, setShowIndicator] = useState(false);
  const progressBarRef = useRef(null);
  const hideIndicatorTimeoutRef = useRef(null);
  const lastScrollPositionRef = useRef(0);
  const isUserInteractingRef = useRef(false);
  const isAutoScrollingRef = useRef(false);

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

  const toggleVideo = () => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.paused ? vid.play() : vid.pause();
    setIsPlaying(!vid.paused);
  };

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

  const showIndicatorTemporarily = () => {
    setShowIndicator(true);
    if (hideIndicatorTimeoutRef.current) {
      clearTimeout(hideIndicatorTimeoutRef.current);
    }
    hideIndicatorTimeoutRef.current = setTimeout(() => {
      setShowIndicator(false);
      isUserInteractingRef.current = false;
    }, 1500);
  };

  const scrollToSlide = (index, smooth = true, isAuto = false) => {
    if (!scrollRef.current || window.innerWidth >= 768) return;
    if (isAuto) isAutoScrollingRef.current = true;

    const container = scrollRef.current;
    const slideWidth = container.scrollWidth / products.length;

    container.scrollTo({
      left: slideWidth * index,
      behavior: smooth ? "smooth" : "auto",
    });
    
    setCurrentSlide(index);
    setVisibleCount(index + 1);

    if (isAuto) {
      setTimeout(() => {
        isAutoScrollingRef.current = false;
      }, 400);
    }
  };

  const handleScroll = () => {
    if (window.innerWidth >= 768) return;
    const container = scrollRef.current;
    if (!container) return;

    const currentScrollLeft = container.scrollLeft;
    const totalScrollWidth = container.scrollWidth - container.offsetWidth;
    
    const scrollPercentage = currentScrollLeft / totalScrollWidth;
    const newSlide = Math.round(scrollPercentage * (products.length - 1));

    if (!isAutoScrollingRef.current) {
      if (!isUserInteractingRef.current) {
        isUserInteractingRef.current = true;
        showIndicatorTemporarily();
      }
      
      if (newSlide !== currentSlide && newSlide >= 0 && newSlide < products.length) {
        setCurrentSlide(newSlide);
        setVisibleCount(newSlide + 1);
      }
    }
  };

  const updateVisibleCountFromPosition = (clientX) => {
    if (!progressBarRef.current || !products.length) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    let x = clientX - rect.left;
    x = Math.max(0, Math.min(x, rect.width));
    const percentage = x / rect.width;
    const segmentIndex = Math.min(Math.floor(percentage * products.length), products.length - 1);
    scrollToSlide(segmentIndex, true, false);
    showIndicatorTemporarily();
  };

  const handleDragStart = (e) => {
    if (window.innerWidth >= 768) return;
    setIsDragging(true);
    isUserInteractingRef.current = true;
    showIndicatorTemporarily();
    const clientX = e.type === "mousedown" ? e.clientX : e.touches[0].clientX;
    updateVisibleCountFromPosition(clientX);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const clientX = e.type === "mousemove" ? e.clientX : e.touches[0].clientX;
    updateVisibleCountFromPosition(clientX);
  };

  const handleDragEnd = () => setIsDragging(false);

  useEffect(() => {
    if (!products.length || isUserInteractingRef.current || isDragging) return;

    const interval = setInterval(() => {
      let nextCount;
      let nextDir = direction;

      if (direction === 1) {
        if (visibleCount === products.length) {
          nextDir = -1;
          nextCount = visibleCount - 1;
        } else {
          nextCount = visibleCount + 1;
        }
      } else {
        if (visibleCount === 1) {
          nextDir = 1;
          nextCount = visibleCount + 1;
        } else {
          nextCount = visibleCount - 1;
        }
      }

      setDirection(nextDir);
      setVisibleCount(nextCount);
      
      if (window.innerWidth < 768) {
        scrollToSlide(nextCount - 1, true, true);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [products.length, direction, visibleCount, isDragging]);

  if (loading || !products.length) return null;

  return (
    <>
      <section className="relative w-full h-[520px] md:h-[700px] overflow-hidden z-10">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="//wonder-theme-fashion.myshopify.com/cdn/shop/videos/c/vp/cb71f93f95a94b7e9d069d767db8ba2a/cb71f93f95a94b7e9d069d767db8ba2a.HD-1080p-7.2Mbps-24784977.mp4"
        />
        <div className="absolute inset-0 bg-black/20" />

        <button
          onClick={toggleVideo}
          className="absolute top-6 left-6 bg-white/90 backdrop-blur p-3 rounded-full shadow-lg z-10"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>

        {/* MOBILE VIEW */}
        <div className="absolute bottom-4 right-0 w-full md:hidden">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            onTouchStart={() => { isUserInteractingRef.current = true; showIndicatorTemporarily(); }}
            className="flex overflow-x-auto snap-x snap-mandatory px-4 scrollbar-hide"
            style={{ scrollBehavior: "smooth", WebkitOverflowScrolling: "touch" }}
          >
            {products.map((product) => (
              <div key={product.id} className="snap-start min-w-[280px]">
                <Link to={`/products/${product.handle}`}>
                  <div className="bg-white mx-1 w-[260px] h-[110px] shadow-2xl flex items-center px-3 relative">
                    <img src={product.image} alt={product.title} className="w-14 object-contain" />
                    <div className="ml-3 pr-10">
                      <p className="text-[10px] text-gray-500">{product.vendor}</p>
                      <p className="text-sm font-medium line-clamp-2">{product.title}</p>
                      <p className="text-sm font-semibold">₹{product.price.toLocaleString("en-IN")}</p>
                    </div>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <button onClick={(e) => handleAddToCart(e, product)} className="w-7 h-7 bg-white shadow flex items-center justify-center">
                        <ShoppingBag size={14} />
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* DESKTOP VIEW - CARDS STACKING EFFECT */}
        <div className="absolute bottom-4 md:bottom-14 right-4 md:right-10 hidden md:flex gap-4">
          {products.slice(0, visibleCount).map((product) => (
            <Link key={product.id} to={`/products/${product.handle}`}>
              <div className="relative bg-white w-[280px] h-[120px] shadow-2xl flex items-center px-4 transition-all duration-500 animate-fadeIn">
                <img src={product.image} alt={product.title} className="w-16 object-contain" />
                <div className="ml-3 pr-12">
                  <p className="text-xs text-gray-500 line-clamp-1">{product.vendor}</p>
                  <p className="text-sm font-medium line-clamp-2">{product.title}</p>
                  <p className="text-base font-semibold">₹{product.price.toLocaleString("en-IN")}</p>
                </div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1.5">
                  <button onClick={(e) => handleAddToCart(e, product)} className="w-8 h-8 bg-white hover:bg-black transition flex items-center justify-center shadow">
                    <ShoppingBag size={14} className="text-black hover:text-white" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ⭐ FULL WIDTH MOBILE PROGRESS BAR WITH TOP GAP ⭐ */}
      {products.length > 1 && showIndicator && (
        <div className="md:hidden w-full mt-2 relative animate-fadeIn">
          {/* Track background */}
          <div 
            ref={progressBarRef}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            onMouseMove={handleDragMove}
            onTouchMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onTouchEnd={handleDragEnd}
            className="w-full h-[4px] bg-gray-200 cursor-pointer touch-none"
          >
            {/* Active Indicator Bar */}
            <div
              className="absolute h-full bg-black transition-all duration-300 ease-out"
              style={{
                width: `${100 / products.length}%`,
                left: `${(currentSlide * 100) / products.length}%`,
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}