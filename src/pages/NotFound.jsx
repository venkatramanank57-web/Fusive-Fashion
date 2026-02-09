import { Link, useLocation } from "react-router-dom";

// Move brands configuration to a separate file for better organization
import { BRANDS, COLLECTION_BRAND_MAP, getBrandFromPath } from "../config/brands";

export default function NotFound() {
  const location = useLocation();
  const brand = getBrandFromPath(location.pathname);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden z-10">
      
      {/* Background Section - Add loading state */}
      <div className="absolute inset-0">
        <img
          src={brand.bgImage}
          alt={`${brand.name} background`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div 
          className={`absolute inset-0 ${brand.overlayColor} backdrop-blur-[2px]`}
          aria-hidden="true"
        />
      </div>

      {/* Content Card */}
      <div className="relative bg-white/80 backdrop-blur-xl px-6 md:px-16 py-12 rounded-2xl shadow-2xl text-center max-w-lg mx-6">
        
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-light tracking-widest mb-4">
            404
          </h1>
          <div className="h-0.5 w-20 bg-gray-300 mx-auto"></div>
        </div>

        {/* Message Section */}
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-semibold mb-3">
            Page not found
          </h2>
          <p className="text-gray-600 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          {/* Brand Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
            <span className="text-sm font-medium text-gray-700">
              {brand.name}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className={`
              inline-flex items-center justify-center
              border ${brand.primaryColor} ${brand.hoverColor}
              px-6 py-3 text-sm font-medium tracking-wider
              transition-all duration-300 ease-in-out
              hover:scale-[1.02] active:scale-[0.98]
            `}
          >
            RETURN TO HOME
          </Link>
          
          <Link
            to="/collections/clothing"
            className={`
              inline-flex items-center justify-center
              border ${brand.primaryColor} ${brand.hoverColor}
              px-6 py-3 text-sm font-medium tracking-wider
              transition-all duration-300 ease-in-out
              hover:scale-[1.02] active:scale-[0.98]
            `}
          >
            BROWSE COLLECTIONS
          </Link>
        </div>

        {/* Optional: Add a helpful tip */}
        <p className="mt-8 text-sm text-gray-500">
          Can't find what you're looking for? Try our search feature.
        </p>
      </div>
    </div>
  );
}