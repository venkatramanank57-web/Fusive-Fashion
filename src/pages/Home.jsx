import React from "react";
import HeroSection from "../components/Home/HeroSection";
import Bestseller from "../components/Home/Bestseller";
import FeaturedCollections from "../components/Home/FeaturedCollections";
import CuratedCollection from "../components/Home/CuratedCollection";
import ShoppableVideo from "../components/Home/ShoppableVideo";
import CampaignSection from "../components/Home/CampaignSection";
import ParallaxSaleSection from "../components/Home/ParallaxSaleSection";
import SplitImageVideoSection from "../components/Home/SplitImageVideoSection";
import InspirationReels from "../components/Home/InspirationReels";

function Home() {
  return (
    <>
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

    </>
  );
}

export default Home;
