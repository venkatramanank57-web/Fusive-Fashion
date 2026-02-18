export default function HomeSkeleton() {
  return (
    /* ⭐ Added bg-white and min-h-screen to cover the full viewport */
    <div className="animate-pulse relative z-10 bg-white min-h-screen">
      
      {/* Hero skeleton */}
      <div className="h-[90vh] bg-gray-200"></div>

      {/* Sections skeleton */}
      <div className="space-y-16 p-6">
        <div className="h-10 bg-gray-200 w-1/3 mx-auto rounded"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded"></div>
          ))}
        </div>

        <div className="h-80 bg-gray-200 rounded"></div>
        <div className="h-80 bg-gray-200 rounded"></div>
        <div className="h-96 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}