import React from "react";
import { useSelector } from "react-redux";
import CollectionSlider from "../common/CollectionSlider";
import { GET_COLLECTION_PRODUCTS } from "../../api/shopify/products";

function RelatedProducts() {
  console.log("✅ RelatedProducts component rendered");

  // ⭐ get current product from Redux
  const product = useSelector((state) => state.product.currentProduct);
  console.log("🟢 Redux product in RelatedProducts:", product);

  // wait until product loads
  if (!product) {
    console.log("⏳ Product not yet in Redux");
    return null;
  }

  // get first collection handle
  const collectionHandle =
    product.collections?.edges?.[0]?.node?.handle;

  console.log("🟣 Collection handle:", collectionHandle);
  console.log("🟣 Full collections object:", product.collections);

  // if no collection → don't show section
  if (!collectionHandle) {
    console.log("❌ No collection found → slider hidden");
    return null;
  }

  console.log("🚀 Rendering CollectionSlider with:", {
    handle: collectionHandle,
  });

  return (
    <CollectionSlider
      title="You may also like"
      query={GET_COLLECTION_PRODUCTS}
      variables={{ handle: collectionHandle }}
    />
  );
}

export default RelatedProducts;
