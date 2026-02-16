export default function HomeSkeleton() {
  return (
    <div className="animate-pulse relative z-10">

      {/* HERO skeleton */}
      <div className="h-[90vh] bg-gray-200" />

      {/* Bestseller */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="h-8 w-48 bg-gray-200 mb-10 rounded"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array(4).fill().map((_, i) => (
            <div key={i} className="h-80 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Collections */}
      <div className="h-[70vh] bg-gray-100" />

      {/* Video / Campaign blocks */}
      <div className="h-[70vh] bg-gray-200" />
      <div className="h-[70vh] bg-gray-100" />

      {/* Reels / Instagram */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-3 gap-4">
          {Array(6).fill().map((_, i) => (
            <div key={i} className="h-60 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="h-60 bg-gray-200" />

    </div>
  );
}
