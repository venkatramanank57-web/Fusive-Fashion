import React from 'react'
import FAQHero from '../components/faq/FAQHero';
import FAQAccordion from '../components/faq/FAQAccordion';

function FAQPage() {
  return (
    <div className="bg-white  relative z-10">
         <FAQHero />         {/*slide-1*/}
         <FAQAccordion />    {/*slide-1*/}
    </div>
  )
}

export default FAQPage