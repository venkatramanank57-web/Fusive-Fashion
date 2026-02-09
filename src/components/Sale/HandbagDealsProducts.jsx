import CollectionSlider from "../Common/CollectionSlider";
import {GET_PRODUCTS } from "../../api/shopify/products";

export default function HandbagDealsProducts() {
  return (
    <CollectionSlider
      title="Handbag Deals"
      query={GET_PRODUCTS}
    />
  );
}
