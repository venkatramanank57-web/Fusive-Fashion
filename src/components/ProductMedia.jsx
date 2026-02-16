// =====================================
// ProductMedia.jsx
// Fixed: Thumbnail strip stays sticky on left side during scroll
// Fixed: Mobile z-index issue - media section stays on top
// Removed: Background block behind thumbnails and right-side indicator dots on desktop
// Responsive: Vertical on desktop, horizontal on mobile with bottom thumbnails
// No navigation arrows - clean, minimal design
// =====================================

import { useEffect, useRef, useState } from "react";
import { X, Play, Pause } from "lucide-react";

export default function ProductMedia({ media = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);
  const fullscreenContainerRef = useRef(null);
  const thumbnailRowRef = useRef(null);
  const videoRefs = useRef({});

  // Filter media to only include IMAGE and VIDEO types
  const validMedia = media.filter(item => 
    item.mediaContentType === "IMAGE" || 
    item.mediaContentType === "VIDEO" ||
    item.mediaContentType === "EXTERNAL_VIDEO"
  );

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is typical tablet/mobile breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset active index when media changes (color change)
  useEffect(() => {
    setActiveIndex(0);
    // Scroll to top/start when media changes
    if (containerRef.current) {
      if (isMobile) {
        containerRef.current.scrollLeft = 0;
      } else {
        containerRef.current.scrollTop = 0;
      }
    }
  }, [media, isMobile]);

  // Handle video play/pause
  const handleVideoPlay = (index) => {
    const videoElement = videoRefs.current[index];
    if (!videoElement) return;

    if (videoElement.paused) {
      videoElement.play();
      setIsVideoPlaying(true);
    } else {
      videoElement.pause();
      setIsVideoPlaying(false);
    }
  };

  // Handle scroll to update active index (desktop - vertical)
  const handleVerticalScroll = () => {
    if (!containerRef.current || validMedia.length === 0 || isMobile) return;
    
    const scrollTop = containerRef.current.scrollTop;
    const itemHeight = containerRef.current.clientHeight;
    const newIndex = Math.round(scrollTop / itemHeight);
    
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < validMedia.length) {
      setActiveIndex(newIndex);
    }
  };

  // Handle scroll to update active index (mobile - horizontal)
  const handleHorizontalScroll = () => {
    if (!containerRef.current || validMedia.length === 0 || !isMobile) return;
    
    const scrollLeft = containerRef.current.scrollLeft;
    const itemWidth = containerRef.current.clientWidth;
    const newIndex = Math.round(scrollLeft / itemWidth);
    
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < validMedia.length) {
      setActiveIndex(newIndex);
    }
  };

  // Handle scroll in fullscreen mode
  const handleFullscreenScroll = () => {
    if (!fullscreenContainerRef.current || validMedia.length === 0) return;
    
    const scrollTop = fullscreenContainerRef.current.scrollTop;
    const itemHeight = fullscreenContainerRef.current.clientHeight;
    const newIndex = Math.round(scrollTop / itemHeight);
    
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < validMedia.length) {
      setActiveIndex(newIndex);
    }
  };

  // Scroll thumbnails into view when active index changes (mobile)
  useEffect(() => {
    if (isMobile && thumbnailRowRef.current && validMedia.length > 1) {
      const thumbnailContainer = thumbnailRowRef.current;
      const activeThumb = thumbnailContainer.children[activeIndex];
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [activeIndex, isMobile, validMedia.length]);

  // Handle keyboard navigation in fullscreen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isFullscreen) return;
      
      switch(e.key) {
        case 'Escape':
          setIsFullscreen(false);
          break;
        case ' ':
          if (validMedia[activeIndex]?.mediaContentType === "VIDEO") {
            e.preventDefault();
            handleVideoPlay(activeIndex);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, activeIndex, validMedia]);

  // Add scroll event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollHandler = isMobile ? handleHorizontalScroll : handleVerticalScroll;
    container.addEventListener('scroll', scrollHandler);
    return () => container.removeEventListener('scroll', scrollHandler);
  }, [isMobile, validMedia.length]);

  // Add scroll event listener for fullscreen
  useEffect(() => {
    if (!isFullscreen) return;
    
    const container = fullscreenContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleFullscreenScroll);
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleFullscreenScroll);
      }
    };
  }, [isFullscreen, validMedia.length]);

  // Handle thumbnail click
  const handleThumbnailClick = (index) => {
    setActiveIndex(index);
    
    // Scroll main gallery to the selected image
    if (containerRef.current) {
      if (isMobile) {
        // Horizontal scroll for mobile
        containerRef.current.scrollTo({
          left: index * containerRef.current.clientWidth,
          behavior: 'smooth'
        });
      } else {
        // Vertical scroll for desktop
        containerRef.current.scrollTo({
          top: index * containerRef.current.clientHeight,
          behavior: 'smooth'
        });
      }
    }
  };

  // Handle opening fullscreen - ensure proper z-index
  const handleOpenFullscreen = () => {
    setIsFullscreen(true);
    // Prevent body scrolling when fullscreen is open
    document.body.style.overflow = 'hidden';
  };

  // Handle closing fullscreen
  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
    // Restore body scrolling
    document.body.style.overflow = '';
  };

  // No media state
  if (validMedia.length === 0) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center relative z-10">
        <div className="text-center">
          <div className="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400">No Images Available</span>
          </div>
          <p className="text-gray-500">Select a color to view images</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Container - Relative positioning for the sticky thumbnail */}
      <div className="sticky top-0 h-screen bg-white overflow-hidden relative z-10">
        {/* Desktop: Sticky Left Thumbnails - NO BACKGROUND BLOCK */}
        {!isMobile && validMedia.length > 1 && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 flex items-center">
            <div className="flex flex-col gap-2">
              {validMedia.map((item, idx) => {
                const thumbnailUrl = item.mediaContentType === "IMAGE" 
                  ? item.image?.url 
                  : item.previewImage?.url || item.image?.url;
                
                return (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleThumbnailClick(idx);
                    }}
                    className={`w-12 h-12 rounded-md overflow-hidden border transition-all hover:scale-105 ${
                      activeIndex === idx
                        ? "border-black ring-2 ring-black/20"
                        : "border-transparent hover:border-black/30"
                    }`}
                    aria-label={`View image ${idx + 1}`}
                  >
                    {item.mediaContentType === "IMAGE" || item.mediaContentType === "EXTERNAL_VIDEO" ? (
                      <img
                        src={thumbnailUrl}
                        alt={item.alt || `Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://placehold.co/48x48/cccccc/666666?text=IMG";
                        }}
                      />
                    ) : (
                      <div className="relative w-full h-full">
                        <img
                          src={thumbnailUrl}
                          alt={item.alt || `Video thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover opacity-90"
                          onError={(e) => {
                            e.target.src = "https://placehold.co/48x48/cccccc/666666?text=VID";
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-5 h-5 bg-white/90 rounded-full flex items-center justify-center">
                            <Play className="w-3 h-3 text-black ml-0.5" />
                          </div>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Media Display with Scroll */}
        <div 
          ref={containerRef}
          className={`h-full overflow-auto scrollbar-hide ${
            isMobile 
              ? "flex overflow-x-auto snap-x snap-mandatory" 
              : "overflow-y-auto snap-y snap-mandatory"
          }`}
          style={{
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {/* All Images in Stack (Vertical for desktop, Horizontal for mobile) */}
          {validMedia.map((item, idx) => (
            <div
              key={idx}
              className={`flex-shrink-0 w-full h-full snap-start flex items-center justify-center relative`}
            >
              <button
                onClick={handleOpenFullscreen}
                className="w-full h-full flex items-center justify-center cursor-zoom-in"
                aria-label="Open full screen"
              >
                {item.mediaContentType === "IMAGE" ? (
                  <img
                    src={item.image?.url}
                    alt={item.alt || item.image?.altText || `Product image ${idx + 1}`}
                    className="max-h-full max-w-full object-contain p-4"
                    onError={(e) => {
                      e.target.src = "https://placehold.co/800x800/cccccc/ffffff?text=Image+Not+Found";
                    }}
                  />
                ) : item.mediaContentType === "EXTERNAL_VIDEO" ? (
                  <div className="relative w-full h-full max-w-3xl p-4">
                    <div className="relative pt-[56.25%]">
                      <iframe
                        src={item.embedUrl}
                        className="absolute inset-0 w-full h-full"
                        title={item.alt || "Product video"}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full max-w-3xl p-4">
                    <video
                      ref={el => videoRefs.current[idx] = el}
                      src={item.sources?.[0]?.url}
                      className="w-full h-full object-contain"
                      poster={item.previewImage?.url}
                      controls
                      onPlay={() => setIsVideoPlaying(true)}
                      onPause={() => setIsVideoPlaying(false)}
                      onEnded={() => setIsVideoPlaying(false)}
                    >
                      <source src={item.sources?.[0]?.url} type={item.sources?.[0]?.mimeType || "video/mp4"} />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Media Counter (Always visible at bottom right) - Keep this for both desktop and mobile */}
        {validMedia.length > 1 && (
          <div className="absolute bottom-6 right-6 bg-black/80 text-white text-sm px-3 py-2 rounded-full backdrop-blur-sm z-10">
            <span className="font-medium">{activeIndex + 1}</span>
            <span className="mx-1 opacity-70">/</span>
            <span className="opacity-90">{validMedia.length}</span>
          </div>
        )}

        {/* Progress Indicator - ONLY FOR MOBILE (removed from desktop) */}
        {isMobile && validMedia.length > 1 && (
          <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 flex flex-row gap-2 z-10">
            {validMedia.map((_, idx) => (
              <div
                key={idx}
                className={`rounded-full transition-all ${
                  activeIndex === idx
                    ? "w-6 h-2 bg-black"
                    : "w-2 h-2 bg-black/40"
                }`}
              />
            ))}
          </div>
        )}

        {/* Mobile: Bottom Thumbnail Row (Horizontal scroll) */}
        {isMobile && validMedia.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 z-20">
            <div 
              ref={thumbnailRowRef}
              className="flex items-center gap-2 overflow-x-auto px-4 py-3 scrollbar-hide"
              style={{
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {validMedia.map((item, idx) => {
                const thumbnailUrl = item.mediaContentType === "IMAGE" 
                  ? item.image?.url 
                  : item.previewImage?.url || item.image?.url;
                
                return (
                  <button
                    key={idx}
                    onClick={() => handleThumbnailClick(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                      activeIndex === idx
                        ? "border-black ring-2 ring-black/20"
                        : "border-transparent hover:border-black/30"
                    }`}
                    aria-label={`View image ${idx + 1}`}
                  >
                    {item.mediaContentType === "VIDEO" ? (
                      <div className="relative w-full h-full">
                        <img
                          src={thumbnailUrl}
                          alt={item.alt || `Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "https://placehold.co/64x64/cccccc/666666?text=VID";
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-5 h-5 bg-black/70 rounded-full flex items-center justify-center">
                            <Play className="w-3 h-3 text-white ml-0.5" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={thumbnailUrl}
                        alt={item.alt || `Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://placehold.co/64x64/cccccc/666666?text=IMG";
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Full Screen Lightbox - FIXED Z-INDEX ISSUE */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[9999] bg-black">
          {/* Close Button */}
          <button
            onClick={handleCloseFullscreen}
            className="absolute top-6 right-6 z-10 p-4 bg-black/70 hover:bg-black/90 rounded-full text-white transition-colors"
            aria-label="Close full screen"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Media Counter */}
          <div className="absolute top-6 left-6 z-10 px-4 py-2 bg-black/70 text-white text-base rounded-full backdrop-blur-sm">
            {activeIndex + 1} / {validMedia.length}
          </div>

          {/* Scroll Container for Full Screen - Horizontal for mobile, Vertical for desktop */}
          <div
            ref={fullscreenContainerRef}
            className={`h-full overflow-auto scrollbar-hide ${
              isMobile 
                ? "flex overflow-x-auto snap-x snap-mandatory" 
                : "overflow-y-auto snap-y snap-mandatory"
            }`}
            style={{
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {validMedia.map((item, idx) => (
              <div
                key={idx}
                className={`flex-shrink-0 w-full h-full snap-start flex items-center justify-center p-4`}
              >
                {item.mediaContentType === "IMAGE" ? (
                  <img
                    src={item.image?.url}
                    alt={item.alt || item.image?.altText || "Product image"}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      e.target.src = "https://placehold.co/1200x1200/cccccc/ffffff?text=Image+Not+Found";
                    }}
                  />
                ) : item.mediaContentType === "EXTERNAL_VIDEO" ? (
                  <div className="w-full h-full max-w-5xl">
                    <div className="relative pt-[56.25%]">
                      <iframe
                        src={item.embedUrl}
                        className="absolute inset-0 w-full h-full rounded-lg"
                        title={item.alt || "Product video"}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full max-w-5xl">
                    <video
                      ref={el => videoRefs.current[idx] = el}
                      src={item.sources?.[0]?.url}
                      className="w-full h-full object-contain rounded-lg"
                      poster={item.previewImage?.url}
                      controls
                      autoPlay={idx === activeIndex}
                      onPlay={() => setIsVideoPlaying(true)}
                      onPause={() => setIsVideoPlaying(false)}
                    >
                      <source src={item.sources?.[0]?.url} type={item.sources?.[0]?.mimeType || "video/mp4"} />
                      Your browser does not support the video tag.
                    </video>
                    {/* Custom Video Controls */}
                    <button
                      onClick={() => handleVideoPlay(idx)}
                      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 p-4 bg-black/70 hover:bg-black/90 rounded-full text-white transition-colors"
                      aria-label={isVideoPlaying ? "Pause video" : "Play video"}
                    >
                      {isVideoPlaying ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Progress Indicator in Full Screen - Mobile only */}
          {isMobile && validMedia.length > 1 && (
            <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 flex flex-row gap-2 z-10">
              {validMedia.map((_, idx) => (
                <div
                  key={idx}
                  className={`rounded-full transition-all ${
                    activeIndex === idx
                      ? "w-6 h-2 bg-white"
                      : "w-2 h-2 bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Vertical Progress Indicator in Full Screen - Desktop only */}
          {!isMobile && validMedia.length > 1 && (
            <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex flex-col items-center gap-3">
              {validMedia.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-3 h-3 rounded-full transition-all ${
                    activeIndex === idx
                      ? "bg-white scale-125 ring-2 ring-white/30"
                      : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Bottom Thumbnails in Full Screen - Mobile only */}
          {isMobile && validMedia.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm border-t border-white/10 z-20">
              <div 
                className="flex items-center gap-2 overflow-x-auto px-4 py-3 scrollbar-hide"
                style={{
                  scrollBehavior: 'smooth',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {validMedia.map((item, idx) => {
                  const thumbnailUrl = item.mediaContentType === "IMAGE" 
                    ? item.image?.url 
                    : item.previewImage?.url || item.image?.url;
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveIndex(idx);
                        if (fullscreenContainerRef.current) {
                          if (isMobile) {
                            fullscreenContainerRef.current.scrollTo({
                              left: idx * fullscreenContainerRef.current.clientWidth,
                              behavior: 'smooth'
                            });
                          } else {
                            fullscreenContainerRef.current.scrollTo({
                              top: idx * fullscreenContainerRef.current.clientHeight,
                              behavior: 'smooth'
                            });
                          }
                        }
                      }}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        activeIndex === idx
                          ? "border-white ring-2 ring-white/50"
                          : "border-transparent hover:border-white/30"
                      }`}
                      aria-label={`View ${idx + 1}`}
                    >
                      <img
                        src={thumbnailUrl}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://placehold.co/64x64/333333/ffffff?text=" + 
                            (item.mediaContentType === "VIDEO" ? "VID" : "IMG");
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}