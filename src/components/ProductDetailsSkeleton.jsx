// =====================================
// ProductDetailsSkeleton.jsx
// PURPOSE:
// - Loading skeleton for product details page
// - Shows while product data is loading
// - Uses Tailwind animations from config
// =====================================

export default function ProductDetailsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-white">
      {/* Left Column - Media Skeleton */}
      <div className="relative h-screen bg-gray-50">
        {/* Main Image Skeleton */}
        <div className="w-full h-full flex items-center justify-center">
          <div className="skeleton-image animate-pulse-slow rounded-lg max-w-3xl max-h-3xl" />
        </div>

        {/* Thumbnails Skeleton */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
          <div className="flex flex-col gap-1 bg-black/10 backdrop-blur-sm py-2 px-1 rounded-r-lg">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-10 h-10 rounded skeleton animate-pulse-slow"
              />
            ))}
          </div>
        </div>

        {/* Navigation Arrows Skeleton */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/10 rounded-full skeleton animate-pulse-slow">
          <div className="w-5 h-5" />
        </div>
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/10 rounded-full skeleton animate-pulse-slow">
          <div className="w-5 h-5" />
        </div>
      </div>

      {/* Right Column - Details Skeleton */}
      <div className="p-6 lg:p-8">
        <div className="max-w-lg mx-auto">
          {/* Top Actions Row Skeleton */}
          <div className="flex items-center justify-between mb-4">
            {/* Brand Skeleton */}
            <div className="skeleton-text w-32 h-4 animate-pulse-slow" />
            
            {/* Action Buttons Skeleton */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full skeleton animate-pulse-slow" />
              <div className="w-9 h-9 rounded-full skeleton animate-pulse-slow" />
            </div>
          </div>

          {/* Product Title Skeleton */}
          <div className="mb-6">
            <div className="skeleton-text w-3/4 h-8 mb-2 animate-pulse-slow" />
            <div className="skeleton-text w-1/2 h-6 animate-pulse-slow" />
          </div>

          {/* Product Tags Skeleton */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="skeleton-text w-16 h-6 rounded-full animate-pulse-slow"
              />
            ))}
          </div>

          {/* Price Skeleton */}
          <div className="mb-8">
            <div className="skeleton-text w-32 h-10 mb-2 animate-pulse-slow" />
            <div className="skeleton-text w-24 h-6 animate-pulse-slow" />
          </div>

          {/* Color Selection Skeleton */}
          <div className="mb-8">
            <div className="skeleton-text w-20 h-5 mb-3 animate-pulse-slow" />
            <div className="flex flex-wrap gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full skeleton animate-pulse-slow"
                />
              ))}
            </div>
          </div>

          {/* Size Selection Skeleton */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="skeleton-text w-16 h-5 animate-pulse-slow" />
              <div className="skeleton-text w-20 h-4 animate-pulse-slow" />
            </div>
            <div className="flex flex-wrap gap-3">
              {['S', 'M', 'L', 'XL'].map((size) => (
                <div
                  key={size}
                  className="w-14 h-14 skeleton rounded-md animate-pulse-slow"
                />
              ))}
            </div>
          </div>

          {/* Add to Cart Button Skeleton */}
          <div className="space-y-4 mb-10">
            <div className="w-full h-12 skeleton rounded-md animate-pulse-slow" />
            <div className="w-full h-12 skeleton rounded-md animate-pulse-slow" />
          </div>

          {/* Description Skeleton */}
          <div className="mb-8">
            <div className="skeleton-text w-32 h-6 mb-4 animate-pulse-slow" />
            <div className="space-y-2">
              <div className="skeleton-text w-full h-3 animate-pulse-slow" />
              <div className="skeleton-text w-5/6 h-3 animate-pulse-slow" />
              <div className="skeleton-text w-4/6 h-3 animate-pulse-slow" />
              <div className="skeleton-text w-full h-3 animate-pulse-slow" />
              <div className="skeleton-text w-3/4 h-3 animate-pulse-slow" />
            </div>
          </div>

          {/* Product Details Skeleton */}
          <div className="border-t border-gray-200 pt-8">
            <div className="mb-8">
              <div className="skeleton-text w-40 h-6 mb-4 animate-pulse-slow" />
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="skeleton-text w-full h-3 animate-pulse-slow"
                  />
                ))}
              </div>
            </div>

            {/* Care Instructions Skeleton */}
            <div>
              <div className="skeleton-text w-48 h-6 mb-4 animate-pulse-slow" />
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="skeleton-text w-full h-3 animate-pulse-slow"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}