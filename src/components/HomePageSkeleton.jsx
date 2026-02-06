// =====================================
// src/components/HomePageSkeleton.jsx
// PURPOSE: Skeleton for home page
// =====================================

export default function HomePageSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh] bg-gray-200 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
      </div>
      
      {/* Featured Collections */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-8 animate-pulse"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="group">
              <div className="aspect-square bg-gray-100 rounded-lg mb-4 animate-pulse overflow-hidden">
                <div className="h-full bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-shimmer"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Featured Products */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="h-10 bg-gray-200 rounded w-64 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm">
                <div className="aspect-square bg-gray-100 animate-pulse overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-shimmer"></div>
                </div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>
                  <div className="h-5 bg-gray-300 rounded w-20 mb-4 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Banner */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="h-64 bg-gray-200 rounded-lg animate-pulse overflow-hidden">
          <div className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
        </div>
      </div>
      
      {/* New Arrivals */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="h-10 bg-gray-200 rounded w-64 mb-8 animate-pulse"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="aspect-square bg-gray-100 animate-pulse"></div>
              <div className="p-3">
                <div className="h-3 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}