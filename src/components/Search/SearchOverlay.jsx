// =====================================
// src/components/Search/SearchOverlay.jsx
// =====================================

import { useQuery } from "@apollo/client/react";
import { X, Search } from "lucide-react";
import { GET_SEARCH_SUGGESTIONS } from "../../api/shopify/search";

export default function SearchOverlay({
  searchQuery,
  setSearchQuery,
  closeSearch,
  navigate,
}) {
  const { data } = useQuery(GET_SEARCH_SUGGESTIONS);

  const products =
    data?.collection?.products?.edges?.map((edge) => edge.node) || [];

  // 🔎 FILTER PRODUCTS WHEN USER TYPES
  const filteredProducts = searchQuery
    ? products.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  const goToProduct = (handle) => {
    navigate(`/products/${handle}`);
    closeSearch();
  };

  const goToSearchPage = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      closeSearch();
    }
  };

  // 👇 Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      goToSearchPage();
    }
  };

  // 👇 Clear text only - does NOT close overlay
  const handleClearText = () => {
    setSearchQuery("");
    // Keep focus on input after clearing
    document.getElementById("search-input")?.focus();
  };

  // 👇 Check if there are any results
  const hasResults = filteredProducts.length > 0;

  return (
    <div className="fixed inset-0 bg-white z-[999] overflow-y-auto">
      
      {/* Search bar */}
      <div className="max-w-5xl mx-auto pt-16 px-6">
        {/* Flex layout with gap */}
        <div className="flex items-center gap-4">
          
          {/* Input wrapper with relative positioning */}
          <div className="relative flex-1">
            <input
              id="search-input"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Find a product..."
              className="w-full border border-gray-400 px-6 py-4 pl-12 pr-12 text-lg outline-none focus:border-black"
            />
            
            {/* Search icon - left side */}
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            
            {/* BUTTON 1: Clear text button (inside input, right side) */}
            {searchQuery && (
              <button
                onClick={handleClearText}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-1 transition-colors"
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* BUTTON 2: Close overlay button (outside input, right side) */}
          <button
            onClick={closeSearch}
            className="text-gray-500 hover:text-black p-2"
            aria-label="Close search overlay"
          >
            <X size={28} />
          </button>
        </div>
      </div>

      {/* ================================================= */}
      {/* 🟢 LAYOUT 1 — TOP SELLERS (NO SEARCH TYPING) */}
      {/* ================================================= */}
      {!searchQuery && (
        <>
          <h2 className="text-center mt-16 mb-10 tracking-widest text-gray-700">
            TOP SELLERS
          </h2>

          <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 pb-20">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => goToProduct(product.handle)}
                className="cursor-pointer text-center"
              >
                <img
                  src={product.featuredImage?.url}
                  className="w-full h-[320px] object-cover mb-4"
                />
                <p className="text-sm">{product.title}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ================================================= */}
      {/* 🔵 LAYOUT 2 — LIVE SEARCH RESULTS */}
      {/* ================================================= */}
      {searchQuery && (
        <div className="max-w-6xl mx-auto mt-14 px-6 pb-20">
          
          {/* ✅ HAS RESULTS - Show products grid */}
          {hasResults ? (
            <div className="grid md:grid-cols-3 gap-16">
              
              {/* LEFT → PRODUCTS */}
              <div className="md:col-span-2 space-y-8">
                {filteredProducts.slice(0, 6).map((product) => (
                  <div
                    key={product.id}
                    onClick={() => goToProduct(product.handle)}
                    className="flex gap-6 cursor-pointer"
                  >
                    <img
                      src={product.featuredImage?.url}
                      className="w-24 h-28 object-cover"
                    />

                    <div>
                      <p className="text-xs text-gray-400 uppercase">Product</p>
                      <p className="font-medium">{product.title}</p>
                      <p className="text-sm text-gray-600">
                        ₹{Math.round(product.priceRange.minVariantPrice.amount)}
                      </p>
                    </div>
                  </div>
                ))}

                {/* VIEW ALL BUTTON - Only show when there are results */}
                <button
                  onClick={goToSearchPage}
                  className="border px-6 py-3 mt-8 hover:bg-black hover:text-white transition-colors"
                >
                  View all for "{searchQuery}"
                </button>
              </div>

              {/* RIGHT → SUGGESTIONS */}
              <div className="space-y-10 border-l pl-10 hidden md:block">
                
                <div>
                  <p className="text-xs text-gray-400 mb-3">SUGGESTIONS</p>
                  <p className="font-medium">skirt</p>
                  <p className="font-medium">sweater</p>
                  <p className="font-medium">midi skirt</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-3">COLLECTIONS</p>
                  <p>Sale</p>
                  <p>Skirts</p>
                  <p>New Spring Look</p>
                </div>

              </div>
            </div>
          ) : (
            /* ❌ NO RESULTS - Show message */
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <h3 className="text-2xl font-medium text-gray-900 mb-3">
                No results found for "{searchQuery}"
              </h3>
              <p className="text-gray-600 text-center max-w-md">
                Check the spelling or use a different word or phrase.
              </p>
              
              {/* Optional: Clear search button */}
              <button
                onClick={handleClearText}
                className="mt-8 text-sm text-gray-500 hover:text-black underline"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}