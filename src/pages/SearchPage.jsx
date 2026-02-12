import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { SEARCH_PRODUCTS } from "../api/shopify/searchPage";

export default function SearchPage() {
  const navigate = useNavigate();
  const { search } = useLocation();

  // get ?q=shirt from URL
  const params = new URLSearchParams(search);
  const query = params.get("q");

  const { data, loading } = useQuery(SEARCH_PRODUCTS, {
    variables: { query }
  });

  const products =
    data?.products?.edges?.map((edge) => edge.node) || [];

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Searching products...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-8">
        Search results for "{query}"
      </h1>

      {products.length === 0 && (
        <p>No products found.</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => navigate(`/products/${product.handle}`)}
            className="cursor-pointer group"
          >
            <div className="overflow-hidden rounded-lg">
              <img
                src={product.featuredImage?.url}
                alt={product.title}
                className="w-full h-64 object-cover group-hover:scale-105 transition"
              />
            </div>

            <p className="mt-3 font-medium">{product.title}</p>
            <p className="text-gray-500">
              ₹{Math.round(product.priceRange.minVariantPrice.amount)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
