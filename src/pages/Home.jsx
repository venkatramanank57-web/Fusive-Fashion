import React, { useEffect, useState } from "react";
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
import HomeSkeleton from "../components/skeleton/HomeSkeleton";

function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); // simulate loading

    return () => clearTimeout(timer);
  }, []);

  if (loading) return <HomeSkeleton />;

  return (
    <div className="bg-white relative z-10">
      <HeroSection />
      <Bestseller />
      <FeaturedCollections />
      <CuratedCollection />
      <ShoppableVideo />
      <CampaignSection />
      <ParallaxSaleSection />
      <SplitImageVideoSection />
      <InspirationReels />
      <BrandsMarquee />
      <JournalSection />
      <PressSlider />
      <InstagramSection />
      <FeaturesBanner />
      <NewsletterSection />
    </div>
  );
}

export default Home;
