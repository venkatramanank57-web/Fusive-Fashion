import { useQuery } from "@apollo/client/react";
import { GET_PRODUCTS } from "../api/shopify/products";

import HeroSection from "../components/Home/HeroSection";
import BestSellerSection from "../components/Home/BestSellerSection";
import ProductCard from "../components/ProductCard";
import HomePageSkeleton from "../components/HomePageSkeleton";

export default function Home() {
  const { data, loading, error } = useQuery(GET_PRODUCTS);

  if (loading) return <HomePageSkeleton />;
  if (error)
    return (
      <p className="p-6 text-red-500">
        Error loading products: {error.message}
      </p>
    );

  const products = data?.products?.edges?.map((edge) => edge.node) || [];

  // ⭐ Bestseller logic (example: first 4 products)
  const bestSellers = products.slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <HeroSection />

      {/* Bestseller Section */}
      <BestSellerSection products={bestSellers} />

      {/* Featured Collection */}
      <section
        className="relative z-10 bg-white"
        aria-label="Featured Products"
      >
        <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Featured Collection
          </h2>

          {products.length === 0 ? (
            <p className="text-center text-gray-500">No products found.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
