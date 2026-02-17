import React from "react";
import HeroSection from "../components/Home/HeroSection";
import Bestseller from "../components/Home/Bestseller";
import FeaturedCollections from "../components/Home/FeaturedCollections";
import CuratedCollection from "../components/Home/CuratedCollection";
import ShoppableVideo from "../components/Home/ShoppableVideo";
import CampaignSection from "../components/Home/CampaignSection";
import ParallaxSaleSection from "../components/Home/ParallaxSaleSection";
import SplitImageVideoSection from "../components/common/SplitImageVideoSection";
import InspirationReels from "../components/Home/InspirationReels";
import BrandsMarquee from "../components/common/BrandsMarquee";
import JournalSection from "../components/Home/JournalSection";
import PressSlider from "../components/Home/PressSlider";
import InstagramSection from "../components/Home/InstagramSection";
import FeaturesBanner from "../components/common/FeaturesBanner";
import NewsletterSection from "../components/common/NewsletterSection";

function Home() {
  return (
     <div className="bg-white  relative z-10">
      {/* Hero stays fixed */}
      <HeroSection />         {/* slide-1 */}
      <Bestseller />          {/* slide-2 */}
      <FeaturedCollections /> {/* slide-3 */}
      <CuratedCollection />   {/* slide-4 */}
      <ShoppableVideo />      {/* slide-5 */}
      <CampaignSection />     {/* slide-6 */}
      <ParallaxSaleSection/>  {/* slide-7 */}
      <SplitImageVideoSection/>{/* slide-8 */}
      <InspirationReels/>     {/* slide-9 */}
      <BrandsMarquee/>        {/* slide-10 */}
      <JournalSection/>       {/* slide-11 */}
      <PressSlider/>          {/* slide-12 */}
      <InstagramSection/>     {/* slide-13 */}
      <FeaturesBanner/>       {/* slide-14 */}
      <NewsletterSection/>    {/* slide-15 */}
   
    </div>
  );
}

export default Home;
