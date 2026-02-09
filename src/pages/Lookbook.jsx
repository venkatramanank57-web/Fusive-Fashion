import LookbookHeader from "../components/Lookbook/LookbookHeader";
import LookbookMasonry from "../components/Lookbook/LookbookMasonry";
import LookbookCollectionsCTA from "../components/Lookbook/LookbookCollectionsCTA";
import SplitImageVideoSection from "../components/Home/SplitImageVideoSection";
import FallIntoComfort from "../components/Lookbook/FallIntoComfort";
import NewsletterSection from "../components/Home/NewsletterSection";

export default function Lookbook() {
  return (
    <div className="bg-white">
      <LookbookHeader />            {/*slide-1*/}
      <LookbookMasonry />           {/*slide-2*/}
      <LookbookCollectionsCTA />    {/* slide-3*/}
      <SplitImageVideoSection/>     {/* slide-4*/}
      <FallIntoComfort/>            {/* slide-5*/}
      <NewsletterSection/>          {/* slide-6 */}
    </div>
  );
}
