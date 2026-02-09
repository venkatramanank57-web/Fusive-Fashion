import CollectionsHero from "../components/ShopByCollections/CollectionsHero";
import CollectionsImageGrid from "../components/ShopByCollections/CollectionsImageGrid";
import Bestseller from "../components/Home/Bestseller";
import NewsletterSection from "../components/Home/NewsletterSection";


export default function ShopByCollections() {
  return (
    <div className="bg-white relative z-10">

     
      <CollectionsHero />    {/* ⭐ HERO (Shopify style) */}
      <CollectionsImageGrid />   {/*slide-2*/}
      <Bestseller />             {/* slide-3 */}
      <NewsletterSection/>       {/* slide-4 */}

      

    </div>
  );
}
