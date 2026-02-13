// =====================================
// src/pages/SearchPage.jsx
// FIXED VERSION - Header matches product card styling WITH SORT DROPDOWN BELOW TABS
// =====================================

import { useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { SEARCH_PRODUCTS } from "../api/shopify/searchPage";
import ProductCard, { ProductCardSkeleton } from "../components/ProductCard";
import { useState, useMemo } from "react";
import NewsletterSection from "../components/common/NewsletterSection";

export default function SearchPage() {
  const { search } = useLocation();
  const [sortOption, setSortOption] = useState("featured"); // Default sort option

  const params = new URLSearchParams(search);
  const query = params.get("q")?.trim() || "";

  const { data, loading, error } = useQuery(SEARCH_PRODUCTS, {
    variables: { query },
    skip: !query,
  });

  const products = data?.products?.edges?.map((edge) => edge.node) || [];

  // Sort products based on selected option
  const sortedProducts = useMemo(() => {
    if (!products.length) return [];
    
    const productsCopy = [...products];
    
    switch (sortOption) {
      case "price-low-high":
        return productsCopy.sort((a, b) => {
          const priceA = parseFloat(a.priceRange?.minVariantPrice?.amount || 0);
          const priceB = parseFloat(b.priceRange?.minVariantPrice?.amount || 0);
          return priceA - priceB;
        });
      
      case "price-high-low":
        return productsCopy.sort((a, b) => {
          const priceA = parseFloat(a.priceRange?.minVariantPrice?.amount || 0);
          const priceB = parseFloat(b.priceRange?.minVariantPrice?.amount || 0);
          return priceB - priceA;
        });
      
      case "name-asc":
        return productsCopy.sort((a, b) => a.title?.localeCompare(b.title));
      
      case "name-desc":
        return productsCopy.sort((a, b) => b.title?.localeCompare(a.title));
      
      case "featured":
      default:
        return productsCopy; // Return original order (assumed to be featured/relevance)
    }
  }, [products, sortOption]);

  // 🔹 No search term
  if (!query) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">
          Please enter a search term.
        </p>
      </div>
    );
  }

  // 🔹 Error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">
          Something went wrong. Please try again.
        </p>
      </div>
    );
  }

  return (
    <>
    <div className="w-full px-4 sm:px-6 md:px-12 lg:px-20 py-8 sm:py-12 bg-white">
      {/* 🔥 Header */}
      <div className="mb-8 sm:mb-12">
        {/* Title Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
          <h1 className="font-normal text-gray-900 text-xl sm:text-2xl md:text-3xl">
            Search results for{" "}
            <span className="font-medium text-gray-900">
              "{query}"
            </span>
          </h1>
        </div>

        {/* Results count - matching product card price styling */}
        {!loading && (
          <p className="text-sm sm:text-base font-medium text-gray-500 mb-6 sm:mb-8">
            {products.length} {products.length === 1 ? 'product' : 'products'} found
          </p>
        )}

        {/* Category tabs - matching product card border styling - NOW CENTERED */}
        <div className="border-b border-gray-200">
          <div className="flex justify-center gap-6 sm:gap-8">
            <button className="pb-3 sm:pb-4 border-b-2 border-gray-900 font-medium text-sm sm:text-base text-gray-900">
              Products
            </button>
            <button className="pb-3 sm:pb-4 text-sm sm:text-base text-gray-500 hover:text-gray-900 transition-colors">
              Collections
            </button>
            <button className="pb-3 sm:pb-4 text-sm sm:text-base text-gray-500 hover:text-gray-900 transition-colors">
              Articles
            </button>
          </div>
        </div>

        {/* Sort Dropdown - Now positioned below the category tabs */}
        {!loading && products.length > 0 && (
          <div className="flex justify-end mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 hidden sm:inline">Sort by:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="px-3 py-2 text-sm sm:text-base border border-gray-300 
                         rounded-md bg-white text-gray-700 cursor-pointer
                         hover:border-gray-400 focus:outline-none focus:ring-2 
                         focus:ring-gray-200 transition-all duration-300"
                aria-label="Sort products"
              >
                <option value="featured">Featured</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 🔹 Empty State - Matching product card styling */}
      {!loading && products.length === 0 && (
        <div className="text-center py-16 sm:py-20">
          <h2 className="font-normal text-gray-900 text-lg sm:text-xl mb-3">
            No products found
          </h2>
          <p className="text-sm sm:text-base text-gray-500">
            Try searching with different keywords or browse our collections.
          </p>
        </div>
      )}

      {/* 🔹 Products Grid - Responsive grid matching product card */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {/* Skeleton Loader */}
        {loading &&
          Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))
        }

        {/* Real Products - Now using sorted products */}
        {!loading &&
          sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))
        }
      </div>

      {/* 🔹 Load More Button - Optional, matching product card styling */}
      {!loading && products.length > 0 && products.length >= 50 && (
        <div className="mt-10 sm:mt-12 text-center">
          <button className="px-6 sm:px-8 py-2.5 sm:py-3 border border-gray-300 
                           text-sm sm:text-base font-medium text-gray-700 
                           hover:border-gray-900 hover:text-gray-900 
                           transition-all duration-300 rounded-md">
            Load more products
          </button>
        </div>
      )}

     
    </div>
     <NewsletterSection/>  
    </>
  );
}