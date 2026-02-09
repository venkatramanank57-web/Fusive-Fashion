import React from "react";
import ProductDetails from "../pages/ProductDetails";
import FeaturesBanner from "../components/Home/FeaturesBanner";
import ProductVideoBanner from "../components/ProductPage/ProductVideoBanner"
import ProductPromoBanner from "../components/ProductPage/ProductPromoBanner";
import ProductMarqueeBanner from "../components/ProductPage/ProductMarqueeBanner";
import InspirationReels from "../components/Home/InspirationReels";
import NewsletterSection from "../components/Home/NewsletterSection";

function ProductDetailPage() {
  return (
    <div className="bg-white">
      <ProductDetails />                      {/* slide-1 */}
      <FeaturesBanner/>                       {/* slide-1 */}
      <ProductVideoBanner/>                   {/* slide-1 */}
      {/* <RelatedProducts/> */}              {/* slide-1 */}
      <ProductPromoBanner />                  {/* slide-1 */}
      <ProductMarqueeBanner/>                 {/* slide-1 */}
      <InspirationReels/>                     {/* slide-1 */}
      {/* <ProductRecommendations /> */}      {/* slide-1 */}
      <NewsletterSection/>                    {/* slide-1 */}
    </div> 
  );
}

export default ProductDetailPage;
