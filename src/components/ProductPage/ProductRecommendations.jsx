import React from 'react'
import CollectionSlider from "../common/CollectionSlider";
import {GET_BESTSELLERS } from "../../api/shopify/bestsellerCollection";

function ProductRecommendations() {
  return (
     <CollectionSlider
          title="Product recommendations"
          query={GET_BESTSELLERS}
          variables={{ first: 12 }}
        />
  )
}

export default ProductRecommendations