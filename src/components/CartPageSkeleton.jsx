// src/components/skeletons/CartPageSkeleton.jsx
export default function CartPageSkeleton() {
  return (
    <div className="cart-skeleton">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="skeleton-text w-64 h-8 mb-2"></div>
          <div className="skeleton-text w-40"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="skeleton-image w-full sm:w-32 h-32 rounded"></div>
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between">
                      <div className="space-y-2">
                        <div className="skeleton-text w-48"></div>
                        <div className="skeleton-text w-32"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="skeleton-text w-24"></div>
                        <div className="skeleton-text w-16"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="skeleton-button w-10"></div>
                        <div className="skeleton-text w-12"></div>
                        <div className="skeleton-button w-10"></div>
                      </div>
                      <div className="skeleton-button w-24"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <div className="skeleton-text w-48 h-7 mb-6"></div>
              <div className="space-y-4 mb-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="skeleton-text w-32"></div>
                    <div className="skeleton-text w-20"></div>
                  </div>
                ))}
              </div>
              <div className="skeleton-button h-12 mb-4"></div>
              <div className="skeleton-text w-3/4 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}