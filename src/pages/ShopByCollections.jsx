import CollectionsHero from "../components/ShopByCollections/CollectionsHero";
import CollectionsImageGrid from "../components/ShopByCollections/CollectionsImageGrid";
import Bestseller from "../components/Home/Bestseller";
import FeaturesBanner from "../components/common/FeaturesBanner";
import NewsletterSection from "../components/common/NewsletterSection";


export default function ShopByCollections() {
  return (
    <div className="bg-white relative z-10">

     
      <CollectionsHero />    {/* ⭐ HERO (Shopify style) */}
      <CollectionsImageGrid />   {/*slide-2*/}
      <Bestseller />             {/* slide-3 */}
      <FeaturesBanner/>          {/* slide-4 */}
      <NewsletterSection/>       {/* slide-5 */}

      

    </div>
  );
}
