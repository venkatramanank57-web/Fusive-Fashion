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

  /* Function to show indicator */
  const showIndicatorTemporarily = () => {
    setShowIndicator(true);
    
    // Clear existing timeout
    if (hideIndicatorTimeoutRef.current) {
      clearTimeout(hideIndicatorTimeoutRef.current);
    }
    
    // Set new timeout to hide indicator after 1.5 seconds of no interaction
    hideIndicatorTimeoutRef.current = setTimeout(() => {
      setShowIndicator(false);
      isUserInteractingRef.current = false;
    }, 1500);
  };

  /* MOBILE: SCROLL TO SLIDE FUNCTION */
  const scrollToSlide = (index, smooth = true, isAuto = false) => {
    if (!scrollRef.current || window.innerWidth >= 768) return;
    
    // Set auto-scrolling flag
    if (isAuto) {
      isAutoScrollingRef.current = true;
    }
    
    const container = scrollRef.current;
    const slideWidth = container.offsetWidth;
    
    container.scrollTo({ 
      left: slideWidth * index, 
      behavior: smooth ? "smooth" : "auto" 
    });
    setCurrentSlide(index);
    setVisibleCount(index + 1);
    
    // Reset auto-scrolling flag after scroll completes
    if (isAuto) {
      setTimeout(() => {
        isAutoScrollingRef.current = false;
      }, 400);
    }
  };

  /* MOBILE: Handle scroll events - ONLY show indicator on MANUAL scroll */
  const handleScroll = () => {
    if (window.innerWidth >= 768) return;
    
    const container = scrollRef.current;
    if (!container) return;
    
    const currentScrollLeft = container.scrollLeft;
    
    // Check if scroll position actually changed AND it's NOT auto-scrolling
    if (currentScrollLeft !== lastScrollPositionRef.current && !isAutoScrollingRef.current) {
      // User is manually scrolling
      if (!isUserInteractingRef.current) {
        isUserInteractingRef.current = true;
        showIndicatorTemporarily();
      }
      
      lastScrollPositionRef.current = currentScrollLeft;
      
      const slideWidth = container.offsetWidth;
      const newSlide = Math.round(currentScrollLeft / slideWidth);
      
      if (newSlide !== currentSlide) {
        setCurrentSlide(newSlide);
        setVisibleCount(newSlide + 1);
      }
    }
  };

  /* Touch/Mouse event handlers for scroll start */
  const handleInteractionStart = () => {
    isUserInteractingRef.current = true;
    showIndicatorTemporarily();
  };

  const handleInteractionEnd = () => {
    // Don't immediately hide, let the timeout handle it
  };

  /* MOBILE: PROGRESS BAR DRAG FUNCTIONS */
  const updateVisibleCountFromPosition = (clientX) => {
    if (!progressBarRef.current || !products.length || window.innerWidth >= 768) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    let x = clientX - rect.left;
    
    x = Math.max(0, Math.min(x, rect.width));
    
    const percentage = x / rect.width;
    const segmentIndex = Math.floor(percentage * products.length);
    scrollToSlide(segmentIndex, true, false); // Not auto-scroll
    showIndicatorTemporarily();
  };

  const handleDragStart = (e) => {
    if (window.innerWidth >= 768) return;
    
    if (e.type === 'mousedown') {
      e.preventDefault();
    }
    setIsDragging(true);
    isUserInteractingRef.current = true;
    showIndicatorTemporarily();
    updateVisibleCountFromPosition(e.type === 'mousedown' ? e.clientX : e.touches[0].clientX);
  };

  const handleDragMove = (e) => {
    if (!isDragging || window.innerWidth >= 768) return;
    
    if (e.type === 'mousemove') {
      e.preventDefault();
    }
    
    const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    updateVisibleCountFromPosition(clientX);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  /* DESKTOP: SINGLE NEXT / PREV BUTTON */
  const handleStepCards = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setVisibleCount((prev) => {
      if (direction === 1) {
        if (prev === products.length) {
          setDirection(-1);
          return prev - 1;
        }
        return prev + 1;
      }

      if (direction === -1) {
        if (prev === 1) {
          setDirection(1);
          return prev + 1;
        }
        return prev - 1;
      }

      return prev;
    });
  };

  /* AUTO ANIMATION FOR BOTH DESKTOP AND MOBILE */
  useEffect(() => {
    if (!products.length) return;

    // Don't auto-scroll if user is manually interacting
    if (isUserInteractingRef.current || isDragging) return;

    const interval = setInterval(() => {
      setVisibleCount((prev) => {
        let newCount;
        if (direction === 1) {
          if (prev === products.length) {
            setDirection(-1);
            newCount = prev - 1;
          } else {
            newCount = prev + 1;
          }
        } else {
          if (prev === 1) {
            setDirection(1);
            newCount = prev + 1;
          } else {
            newCount = prev - 1;
          }
        }
        
        // Update scroll position for mobile - mark as auto-scroll
        if (window.innerWidth < 768 && scrollRef.current) {
          const container = scrollRef.current;
          const slideWidth = container.offsetWidth;
          
          // Set auto-scrolling flag
          isAutoScrollingRef.current = true;
          
          container.scrollTo({ 
            left: slideWidth * (newCount - 1), 
            behavior: "smooth" 
          });
          setCurrentSlide(newCount - 1);
          
          // Reset auto-scrolling flag after scroll completes
          setTimeout(() => {
            isAutoScrollingRef.current = false;
          }, 400);
        }
        
        return newCount;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [products.length, direction, isDragging]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (hideIndicatorTimeoutRef.current) {
        clearTimeout(hideIndicatorTimeoutRef.current);
      }
    };
  }, []);

  if (loading || !products.length) return null;

  return (
    <>
      <section className="relative w-full h-[520px] md:h-[700px] overflow-hidden z-10">
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

        <div className="absolute inset-0 bg-black/20" />

        {/* PLAY BUTTON */}
        <button
          onClick={toggleVideo}
          className="absolute top-6 left-6 bg-white/90 backdrop-blur p-3 rounded-full shadow-lg z-10"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>

        {/* STACK CARDS - DESKTOP VIEW */}
        <div className="absolute bottom-4 md:bottom-14 right-4 md:right-10 hidden md:flex gap-4">
          {products.slice(0, visibleCount).map((product) => (
            <Link key={product.id} to={`/products/${product.handle}`}>
              <div className="relative bg-white 
                w-[240px] sm:w-[260px] md:w-[280px]
                h-[100px] sm:h-[110px] md:h-[120px]
                shadow-2xl flex items-center px-3 md:px-4 animate-fadeIn">

                <img
                  src={product.image}
                  alt={product.title}
                  className="w-12 sm:w-14 md:w-16 object-contain"
                />

                <div className="ml-3 pr-10 md:pr-12">
                  <p className="text-[9px] sm:text-[10px] md:text-xs tracking-widest text-gray-500 mb-0.5 line-clamp-1">
                    {product.vendor}
                  </p>
                  <p className="text-xs sm:text-sm md:text-sm font-medium leading-tight line-clamp-2 mb-0.5">
                    {product.title}
                  </p>
                  <p className="text-xs sm:text-sm md:text-base font-semibold">
                    ₹{product.price.toLocaleString("en-IN")}
                  </p>
                </div>

                {/* RIGHT ICON COLUMN */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1.5">
                  {/* ADD TO CART BUTTON */}
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="group w-7 h-7 md:w-8 md:h-8 bg-white hover:bg-black transition flex items-center justify-center shadow"
                  >
                    <ShoppingBag
                      size={14}
                      className="text-black group-hover:text-white transition"
                    />
                  </button>

                  {/* NEXT / PREV (BOTTOM) - HIDDEN ON MOBILE */}
                  <button
                    onClick={handleStepCards}
                    className="hidden md:flex group w-8 h-8 bg-white hover:bg-black transition items-center justify-center shadow"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className="text-black group-hover:text-white transition">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* MOBILE SCROLLABLE CARDS */}
        <div className="absolute bottom-4 md:bottom-14 right-0 w-full overflow-hidden md:hidden">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            onTouchStart={handleInteractionStart}
            onTouchEnd={handleInteractionEnd}
            onTouchCancel={handleInteractionEnd}
            onMouseDown={handleInteractionStart}
            onMouseUp={handleInteractionEnd}
            onMouseLeave={handleInteractionEnd}
            className="flex overflow-x-auto snap-x snap-mandatory pb-2 px-4"
            style={{
              scrollBehavior: "smooth",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <style>{`div::-webkit-scrollbar { display: none; }`}</style>

            {products.map((product) => (
              <div
                key={product.id}
                className="snap-start"
                style={{ minWidth: '280px' }}
              >
                <Link to={`/products/${product.handle}`}>
                  <div className="bg-white mx-1
                    w-[240px] sm:w-[260px]
                    h-[100px] sm:h-[110px]
                    shadow-2xl flex items-center px-3 relative">

                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-12 sm:w-14 object-contain"
                    />

                    <div className="ml-3 pr-10">
                      <p className="text-[9px] sm:text-[10px] tracking-widest text-gray-500 mb-0.5 line-clamp-1">
                        {product.vendor}
                      </p>
                      <p className="text-xs sm:text-sm font-medium leading-tight line-clamp-2 mb-0.5">
                        {product.title}
                      </p>
                      <p className="text-xs sm:text-sm font-semibold">
                        ₹{product.price.toLocaleString("en-IN")}
                      </p>
                    </div>

                    {/* ADD TO CART BUTTON - MOBILE */}
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="group w-7 h-7 bg-white hover:bg-black transition flex items-center justify-center shadow"
                      >
                        <ShoppingBag
                          size={14}
                          className="text-black group-hover:text-white transition"
                        />
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ⭐ MOBILE PROGRESS BAR - SHOWS ONLY DURING USER INTERACTION */}
      {products.length > 1 && showIndicator && (
        <div className="md:hidden w-full mt-2 mb-4 px-4 animate-fadeIn">
          <div className="w-full">
            <div className="h-[4px] bg-gray-200 relative rounded-full overflow-hidden">
              <div
                ref={progressBarRef}
                onClick={handleDragStart}
                onMouseDown={handleDragStart}
                onMouseMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchStart={handleDragStart}
                onTouchMove={handleDragMove}
                onTouchEnd={handleDragEnd}
                className="absolute h-full bg-black transition-all duration-300 cursor-pointer"
                style={{
                  width: `${100 / products.length}%`,
                  transform: `translateX(${currentSlide * 100}%)`,
                  touchAction: 'none'
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}