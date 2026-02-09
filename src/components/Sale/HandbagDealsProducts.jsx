import CollectionSlider from "../common/CollectionSlider";
import {GET_PRODUCTS } from "../../api/shopify/products";

export default function HandbagDealsProducts() {
  return (
    <CollectionSlider
      title="Handbag Deals"
      query={GET_PRODUCTS}
    />
  );
}
