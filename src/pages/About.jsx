import AboutHero from "../components/About/AboutHero";
import AboutThanks from "../components/About/AboutThanks";
import AboutVideoSection from "../components/About/AboutVideoSection";
import BrandsMarquee from "../components/common/BrandsMarquee";
import AboutMosaicStats from "../components/About/AboutMosaicStats";
import FeaturesBanner from "../components/common/FeaturesBanner";
import AboutScrollingStory from "../components/About/AboutScrollingStory";
import CollectionFeature from "../components/About/CollectionFeature";
import NewsletterSection from "../components/common/NewsletterSection";

export default function About() {
  return (
    <div className="bg-white  relative z-10">
      <AboutHero />                        {/*slide-1*/}
      <AboutThanks />                      {/*slide-2*/}
      <AboutVideoSection />                {/*slide-3*/}
      <BrandsMarquee
        showHeading={true}
        title="OUR BRANDS"                 
      />                                   {/*slide-4*/}
      <AboutMosaicStats />                 {/*slide-5*/}
      <FeaturesBanner/>                    {/*slide-6*/}
      <AboutScrollingStory />              {/*slide-6*/}
      <CollectionFeature />                {/*slide-7*/}
      <NewsletterSection/>                 {/*slide-8*/}
 
    </div>
  );
}
