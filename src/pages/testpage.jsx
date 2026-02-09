import React from 'react'
import CollectionSlider from "../components/common/CollectionSlider";
import {GET_BESTSELLERS } from "../api/shopify/bestsellerCollection";

function testpage() {
  return (
    <div>Bestseller


       <CollectionSlider
             title="Our Bestseller"
             query={GET_BESTSELLERS}
             variables={{ first: 12 }}
           />
    </div>
  )
}

export default testpage