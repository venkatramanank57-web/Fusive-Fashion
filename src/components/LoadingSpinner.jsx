// =====================================
// src/components/LoadingSpinner.jsx
// =====================================

export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-baltic mx-auto mb-4"></div>
        <p className="text-gray-600">{message}</p>
        <p className="text-sm text-gray-500 mt-2">
          Fetching data from Shopify...
        </p>
      </div>
    </div>
  );
}