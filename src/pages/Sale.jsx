import SaleCountdownBanner from "../components/Sale/SaleCountdownBanner";
import SaleScrollingText from "../components/Sale/SaleScrollingText";
import SaleProductsSection from "../components/Sale/SaleProductsSection";
import SalePromoSplit  from "../components/Sale/SalePromoSplit";
import FinalSale from "../components/Sale/FinalSale";
import BagsSaleBanner from "../components/Sale/BagsSaleBanner";
import HandbagDealsProducts from "../components/Sale/HandbagDealsProducts";
import TestimonialsSlider from "../components/Sale/TestimonialsSlider";
import RichTextNavigationSection from "../components/Sale/RichTextNavigationSection";
import NewsletterSection from "../components/Home/NewsletterSection";

export default function Sale() {
  return (
    <>
      <SaleCountdownBanner />                {/*slide-1*/}
      <SaleScrollingText/>                   {/*slide-1*/}
      <SaleProductsSection/>                 {/*slide-1*/}
      <SalePromoSplit />                     {/*slide-1*/}
      <FinalSale/>                           {/*slide-1*/}
      <BagsSaleBanner />                     {/*slide-1*/}
      <HandbagDealsProducts/>                {/*slide-1*/}
      <TestimonialsSlider />                 {/*slide-1*/}
      <RichTextNavigationSection />          {/*slide-1*/}
      <NewsletterSection/>                   {/*slide-1*/}


    </>
  );
}
