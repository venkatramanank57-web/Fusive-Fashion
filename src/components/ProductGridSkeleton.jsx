// =====================================
// src/components/ProductCardSkeleton.jsx
// PURPOSE: Ultra-minimal skeleton that loads fastest
// =====================================

export default function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      {/* Image skeleton */}
      <div className="w-full h-64 bg-gray-100 rounded-md animate-pulse-slow"></div>
      
      {/* Content skeleton */}
      <div className="mt-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse-slow"></div>
        <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse-slow"></div>
        <div className="h-6 bg-gray-300 rounded w-1/4 mt-3 animate-pulse-slow"></div>
      </div>
    </div>
  );
}