export default function HomeSkeleton() {
  return (
    <div className="animate-pulse relative z-10">
      {/* Hero skeleton */}
      <div className="h-[90vh] bg-gray-200"></div>

      {/* Sections skeleton */}
      <div className="space-y-16 p-6">
        <div className="h-10 bg-gray-200 w-1/3 mx-auto"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64 bg-gray-200"></div>
          ))}
        </div>

        <div className="h-80 bg-gray-200"></div>
        <div className="h-80 bg-gray-200"></div>
        <div className="h-96 bg-gray-200"></div>
      </div>
    </div>
  );
}
