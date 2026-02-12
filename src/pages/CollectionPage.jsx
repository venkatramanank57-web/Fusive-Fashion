import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { useState, useMemo } from "react";
import { GET_COLLECTION_BY_HANDLE } from "../api/shopify/collectionByHandle";

import ProductCard, { ProductCardSkeleton } from "../components/ProductCard";
import FilterDrawer from "../components/filters/FilterDrawer";
import ProductCountToolbar from "../components/Collection/ProductCountToolbar";
import RichTextNavigationSection from "../components/Collection//RichTextNavigationSection";
import NewsletterSection from "../components/common/NewsletterSection";
import FeaturesBanner from "../components/common/FeaturesBanner";
import ProductDetailsSkeleton from "../components/ProductGridSkeleton"

export default function CollectionPage() {
  const { handle } = useParams();

  // ⭐ GLOBAL FILTER STATE
  const [filters, setFilters] = useState({
    availability: [],
    colors: [],
    sizes: [],
  });

  // ⭐ GLOBAL SORT STATE
  const [sortOption, setSortOption] = useState("best-selling");

  // ⭐ FILTER DRAWER STATE
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data, loading, error } = useQuery(GET_COLLECTION_BY_HANDLE, {
    variables: { handle },
  });

  const collection = data?.collection;
  const products = collection?.products?.edges || [];

  // ⭐ FILTER PRODUCTS
  const filteredProducts = useMemo(() => {
    return products.filter(({ node }) => {
      const product = node;

      // 1. AVAILABILITY FILTER
      if (filters.availability.length > 0) {
        const isInStock = product.variants?.edges?.some(
          (variant) => variant.node.availableForSale === true,
        );

        // If only "in-stock" is checked
        if (
          filters.availability.includes("in-stock") &&
          !filters.availability.includes("out-of-stock")
        ) {
          if (!isInStock) return false;
        }
        // If only "out-of-stock" is checked
        else if (
          filters.availability.includes("out-of-stock") &&
          !filters.availability.includes("in-stock")
        ) {
          if (isInStock) return false;
        }
      }

      // 2. COLOR FILTER
      if (filters.colors.length > 0) {
        let productColors = [];

        // Try to find colors in product options
        const colorOption = product.options?.find(
          (opt) =>
            opt.name.toLowerCase().includes("color") ||
            opt.name.toLowerCase().includes("colour"),
        );

        if (colorOption?.values) {
          productColors = colorOption.values.map((v) => v.toLowerCase());
        }

        // Also check variant metafields for colors
        product.variants?.edges?.forEach((variant) => {
          if (variant.node.selectedOptions) {
            const colorOption = variant.node.selectedOptions.find(
              (opt) =>
                opt.name.toLowerCase().includes("color") ||
                opt.name.toLowerCase().includes("colour"),
            );
            if (colorOption?.value) {
              productColors.push(colorOption.value.toLowerCase());
            }
          }
        });

        // Remove duplicates
        productColors = [...new Set(productColors)];

        const hasMatchingColor = productColors.some((productColor) =>
          filters.colors.some(
            (filterColor) =>
              productColor.includes(filterColor.toLowerCase()) ||
              filterColor.toLowerCase().includes(productColor),
          ),
        );

        if (!hasMatchingColor) return false;
      }

      // 3. SIZE FILTER
      if (filters.sizes.length > 0) {
        let productSizes = [];

        // Try to find sizes in product options
        const sizeOption = product.options?.find((opt) =>
          opt.name.toLowerCase().includes("size"),
        );

        if (sizeOption?.values) {
          productSizes = sizeOption.values.map((v) => v.toUpperCase());
        }

        // Also check variant metafields for sizes
        product.variants?.edges?.forEach((variant) => {
          if (variant.node.selectedOptions) {
            const sizeOption = variant.node.selectedOptions.find((opt) =>
              opt.name.toLowerCase().includes("size"),
            );
            if (sizeOption?.value) {
              productSizes.push(sizeOption.value.toUpperCase());
            }
          }
        });

        // Remove duplicates
        productSizes = [...new Set(productSizes)];

        const hasMatchingSize = productSizes.some((productSize) =>
          filters.sizes.some(
            (filterSize) =>
              productSize.includes(filterSize.toUpperCase()) ||
              filterSize.toUpperCase().includes(productSize),
          ),
        );

        if (!hasMatchingSize) return false;
      }

      return true;
    });
  }, [products, filters]);

  // ⭐ SORT PRODUCTS
  const sortedAndFilteredProducts = useMemo(() => {
    const productsToSort = [...filteredProducts];

    return productsToSort.sort((a, b) => {
      const productA = a.node;
      const productB = b.node;

      switch (sortOption) {
        case "best-selling":
          return 0;

        case "featured":
          const featuredA = productA.tags?.includes("featured") || false;
          const featuredB = productB.tags?.includes("featured") || false;
          return (featuredB ? 1 : 0) - (featuredA ? 1 : 0);

        case "a-z":
          return productA.title.localeCompare(productB.title);

        case "z-a":
          return productB.title.localeCompare(productA.title);

        case "price-low-high":
          const priceA = parseFloat(
            productA.priceRange?.minVariantPrice?.amount || 0,
          );
          const priceB = parseFloat(
            productB.priceRange?.minVariantPrice?.amount || 0,
          );
          return priceA - priceB;

     case "price-high-low":
  const priceHighA = parseFloat(
    productA.priceRange?.minVariantPrice?.amount || 0,
  );
  const priceHighB = parseFloat(
    productB.priceRange?.minVariantPrice?.amount || 0,
  );
  return priceHighB - priceHighA;

        case "date-old-new":
          const dateA = new Date(productA.createdAt || 0);
          const dateB = new Date(productB.createdAt || 0);
          return dateA - dateB;

        case "date-new-old":
          const dateNewA = new Date(productA.createdAt || 0);
          const dateNewB = new Date(productB.createdAt || 0);
          return dateNewB - dateNewA;

        default:
          return 0;
      }
    });
  }, [filteredProducts, sortOption]);

  // ⭐ HANDLE FILTER CHANGE
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // ⭐ HANDLE REMOVE ALL FILTERS
  const handleRemoveAllFilters = () => {
    setFilters({
      availability: [],
      colors: [],
      sizes: [],
    });
  };

  // ⭐ HANDLE SORT CHANGE
  const handleSortChange = (value) => {
    setSortOption(value);
  };

  // Check if any filters are active
  const hasActiveFilters =
    filters.availability.length > 0 ||
    filters.colors.length > 0 ||
    filters.sizes.length > 0;

  return (
    <div className="bg-white min-h-screen relative z-10">
      {/* ⭐ HERO SECTION */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          {!loading && collection && (
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                {collection.title}
              </h1>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto mb-8">
                {collection.description ||
                  "The perfect look for a modern woman - discover the collection of tailored single and double breasted blazers."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ⭐ PRODUCT COUNT & FILTER/SORT TOOLBAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductCountToolbar
          productCount={products.length}
          filteredCount={sortedAndFilteredProducts.length}
          onOpenFilter={() => setIsFilterOpen(true)}
          sortOption={sortOption}
          onSortChange={handleSortChange}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {/* ⭐ FILTER DRAWER */}
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        setFilters={handleFilterChange}
        products={products}
        onRemoveAll={handleRemoveAllFilters}
      />

      {/* ⭐ ACTIVE FILTERS (Only show when filters are active) */}
      {hasActiveFilters && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-600">Active filters:</span>
            {filters.availability.map((avail) => (
              <span
                key={avail}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {avail === "in-stock" ? "In Stock" : "Out of Stock"}
                <button
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      availability: prev.availability.filter(
                        (a) => a !== avail,
                      ),
                    }))
                  }
                  className="ml-2 text-gray-600 hover:text-gray-900"
                >
                  ×
                </button>
              </span>
            ))}
            {filters.colors.map((color) => (
              <span
                key={color}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {color}
                <button
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      colors: prev.colors.filter((c) => c !== color),
                    }))
                  }
                  className="ml-2 text-gray-600 hover:text-gray-900"
                >
                  ×
                </button>
              </span>
            ))}
            {filters.sizes.map((size) => (
              <span
                key={size}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                Size: {size}
                <button
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      sizes: prev.sizes.filter((s) => s !== size),
                    }))
                  }
                  className="ml-2 text-gray-600 hover:text-gray-900"
                >
                  ×
                </button>
              </span>
            ))}
            <button
              onClick={handleRemoveAllFilters}
              className="text-sm text-gray-600 hover:text-gray-900 underline ml-2"
            >
              Clear all
            </button>
          </div>
        </div>
      )}

      {/* ⭐ PRODUCTS GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Loading */}
          {loading &&
            Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}

          {/* Error */}
          {error && (
            <div className="col-span-full text-center py-20">
              <p className="text-red-600">Error loading products</p>
              <p className="text-gray-500 mt-2">{error.message}</p>
             
            </div>
          )}

          {/* No products found */}
          {!loading && !error && sortedAndFilteredProducts.length === 0 && (
            <div className="col-span-full text-center py-20">
              <p className="text-gray-900 text-lg font-medium">
                No products found
              </p>
              <p className="text-gray-500 mt-2">Try adjusting your filters</p>
              <button
                onClick={handleRemoveAllFilters}
                className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Products */}
          {!loading &&
            !error &&
            sortedAndFilteredProducts.length > 0 &&
            sortedAndFilteredProducts.map(({ node }) => (
              <ProductCard key={node.id} product={node} />
            ))}
        </div>
      </div>

      {/* ⭐ BOTTOM COLLECTION NAVIGATION */}
      <RichTextNavigationSection />      {/* slide-3 */}
      <FeaturesBanner/>                  {/* slide-4 */}

      <NewsletterSection/>               {/* slide-5 */}

    </div>
  );
}

