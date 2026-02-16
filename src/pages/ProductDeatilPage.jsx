import React from "react";
import ProductDetails from "../pages/ProductDetails";
import FeaturesBanner from "../components/common/FeaturesBanner";
import ProductVideoBanner from "../components/ProductPage/ProductVideoBanner"
import ProductPromoBanner from "../components/ProductPage/ProductPromoBanner";
import ProductMarqueeBanner from "../components/ProductPage/ProductMarqueeBanner";
import InspirationReels from "../components/Home/InspirationReels";
import NewsletterSection from "../components/common/NewsletterSection";
import RelatedProducts from "../components/ProductPage/RelatedProducts";
import ProductRecommendations from "../components/ProductPage/ProductRecommendations";

function ProductDetailPage() {
  return (
    <div className="bg-white">
      <ProductDetails />                      {/* slide-1 */}
      <FeaturesBanner/>                       {/* slide-2 */}
      <ProductVideoBanner/>                   {/* slide-3 */}
      <RelatedProducts/>                      {/* slide-4*/}
      <ProductPromoBanner />                  {/* slide-5 */}
      <ProductMarqueeBanner/>                 {/* slide-6 */}
      <InspirationReels/>                     {/* slide-7 */}
      <ProductRecommendations />             {/* slide-8 */}
      <NewsletterSection/>                    {/* slide-9 */}
    </div> 
  );
}

export default ProductDetailPage;
