// =====================================
// ProductMedia.jsx
// No navigation arrows anywhere
// Clean, minimal design
// =====================================

import { useEffect, useRef, useState } from "react";
import { X, Play, Pause } from "lucide-react";

export default function ProductMedia({ media = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const containerRef = useRef(null);
  const fullscreenContainerRef = useRef(null);
  const videoRefs = useRef({});

  // Filter media to only include IMAGE and VIDEO types
  const validMedia = media.filter(item => 
    item.mediaContentType === "IMAGE" || 
    item.mediaContentType === "VIDEO" ||
    item.mediaContentType === "EXTERNAL_VIDEO"
  );

  // Reset active index when media changes (color change)
  useEffect(() => {
    setActiveIndex(0);
    // Scroll to top when media changes
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [media]);

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

  // Handle scroll to update active index
  const handleScroll = () => {
    if (!containerRef.current || validMedia.length === 0) return;
    
    const scrollTop = containerRef.current.scrollTop;
    const itemHeight = containerRef.current.clientHeight;
    const newIndex = Math.round(scrollTop / itemHeight);
    
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

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [validMedia.length]);

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

  // No media state
  if (validMedia.length === 0) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400">No Images Available</span>
          </div>
          <p className="text-gray-500">Select a color to view images</p>
        </div>
      </div>
    );
  }

  const currentMedia = validMedia[activeIndex];

  return (
    <>
      {/* Main Media Display with Vertical Scroll */}
      <div 
        ref={containerRef}
        className="relative h-screen bg-gray-50 overflow-y-auto snap-y snap-mandatory scrollbar-hide"
      >
        {/* Black Vertical Thumbnail Bar (ALWAYS VISIBLE) */}
        {validMedia.length > 1 && (
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
            <div className="flex flex-col gap-1 bg-black/90 backdrop-blur-sm py-3 px-1 rounded-r-lg shadow-2xl">
              {validMedia.map((item, idx) => {
                const thumbnailUrl = item.mediaContentType === "IMAGE" 
                  ? item.image?.url 
                  : item.previewImage?.url || item.image?.url;
                
                return (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveIndex(idx);
                      if (containerRef.current) {
                        const scrollTop = idx * containerRef.current.clientHeight;
                        containerRef.current.scrollTo({
                          top: scrollTop,
                          behavior: 'smooth'
                        });
                      }
                    }}
                    className={`w-12 h-12 rounded overflow-hidden border-2 flex-shrink-0 transition-all hover:scale-105 ${
                      activeIndex === idx
                        ? "border-white ring-2 ring-white/50"
                        : "border-transparent hover:border-white/40"
                    }`}
                    aria-label={`View image ${idx + 1}`}
                  >
                    {item.mediaContentType === "IMAGE" || item.mediaContentType === "EXTERNAL_VIDEO" ? (
                      <img
                        src={thumbnailUrl}
                        alt={item.alt || `Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://placehold.co/48x48/333333/ffffff?text=IMG";
                        }}
                      />
                    ) : (
                      <div className="relative w-full h-full">
                        <img
                          src={thumbnailUrl}
                          alt={item.alt || `Video thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover opacity-80"
                          onError={(e) => {
                            e.target.src = "https://placehold.co/48x48/222222/ffffff?text=VID";
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

        {/* All Images in Vertical Stack */}
        {validMedia.map((item, idx) => (
          <div
            key={idx}
            className="h-screen snap-start flex items-center justify-center relative"
          >
            <button
              onClick={() => setIsFullscreen(true)}
              className="w-full h-full flex items-center justify-center cursor-zoom-in"
              aria-label="Open full screen"
            >
              {item.mediaContentType === "IMAGE" ? (
                <img
                  src={item.image?.url}
                  alt={item.alt || item.image?.altText || `Product image ${idx + 1}`}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/800x800/cccccc/ffffff?text=Image+Not+Found";
                  }}
                />
              ) : item.mediaContentType === "EXTERNAL_VIDEO" ? (
                <div className="relative w-full h-full max-w-3xl">
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
                <div className="relative w-full h-full max-w-3xl">
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

        {/* Media Counter (Always visible at bottom right) */}
        {validMedia.length > 1 && (
          <div className="absolute bottom-6 right-6 bg-black/80 text-white text-sm px-3 py-2 rounded-full backdrop-blur-sm">
            <span className="font-medium">{activeIndex + 1}</span>
            <span className="mx-1 opacity-70">/</span>
            <span className="opacity-90">{validMedia.length}</span>
          </div>
        )}

        {/* Vertical Progress Indicator (Always visible on right side) */}
        {validMedia.length > 1 && (
          <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex flex-col items-center gap-2">
            {validMedia.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${
                  activeIndex === idx
                    ? "bg-white scale-125"
                    : "bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Full Screen Lightbox - NO NAVIGATION ARROWS */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black">
          {/* Close Button */}
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 z-10 p-4 bg-black/70 hover:bg-black/90 rounded-full text-white transition-colors"
            aria-label="Close full screen"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Media Counter */}
          <div className="absolute top-6 left-6 z-10 px-4 py-2 bg-black/70 text-white text-base rounded-full backdrop-blur-sm">
            {activeIndex + 1} / {validMedia.length}
          </div>

          {/* Vertical Scroll Container for Full Screen */}
          <div
            ref={fullscreenContainerRef}
            className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide"
          >
            {validMedia.map((item, idx) => (
              <div
                key={idx}
                className="h-full snap-start flex items-center justify-center p-4"
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
                  <div className="w-full h-full max-w-5xl">
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

          {/* Vertical Progress Indicator in Full Screen */}
          {validMedia.length > 1 && (
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

          {/* Bottom Thumbnails in Full Screen */}
          {validMedia.length > 1 && (
            <div className="absolute bottom-8 left-0 right-0">
              <div className="flex justify-center gap-3 px-6 overflow-x-auto py-3">
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
                          const scrollTop = idx * fullscreenContainerRef.current.clientHeight;
                          fullscreenContainerRef.current.scrollTo({
                            top: scrollTop,
                            behavior: 'smooth'
                          });
                        }
                      }}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                        activeIndex === idx
                          ? "border-white ring-2 ring-white/50 bg-white/10"
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