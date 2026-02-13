// =====================================
// src/components/ArticleCard.jsx
// =====================================
import { Link } from "react-router-dom";

export default function ArticleCard({ article }) {
  return (
    <Link to={`/blogs/${article.blog?.handle}/${article.handle}`} className="block no-underline text-inherit">
      <div className="bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-all">
        <div className="relative aspect-[2/3] md:aspect-[4/5] lg:aspect-[2/3] bg-gray-50">
          {article.image && (
            <img src={article.image.url} alt={article.title} 
                 className="w-full h-full object-cover" loading="lazy" />
          )}
        </div>
        <div className="px-2 sm:px-3 md:px-4 py-2 sm:py-3">
          <p className="text-[10px] text-gray-500 uppercase">{article.blog?.title}</p>
          <h3 className="font-normal text-gray-900 text-xs sm:text-sm line-clamp-2">{article.title}</h3>
          <p className="text-xs text-gray-500 mt-1">{new Date(article.publishedAt).toLocaleDateString()}</p>
        </div>
      </div>
    </Link>
  );
}