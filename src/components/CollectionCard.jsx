// =====================================
// src/components/CollectionCard.jsx
// =====================================
import { Link } from "react-router-dom";

export default function CollectionCard({ collection }) {
  return (
    <Link to={`/collections/${collection.handle}`} className="block no-underline text-inherit">
      <div className="bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-all">
        <div className="relative aspect-[2/3] md:aspect-[4/5] lg:aspect-[2/3] bg-gray-50">
          {collection.image && (
            <img src={collection.image.url} alt={collection.title} 
                 className="w-full h-full object-cover" loading="lazy" />
          )}
        </div>
        <div className="px-2 sm:px-3 md:px-4 py-2 sm:py-3">
          <h3 className="font-normal text-gray-900 text-xs sm:text-sm">{collection.title}</h3>
          <p className="text-xs text-gray-500 mt-1">{collection.productsCount?.count || 0} products</p>
        </div>
      </div>
    </Link>
  );
}