import CollectionSlider from "../common/CollectionSlider";
import {GET_PRODUCTS } from "../../api/shopify/products";

export default function FinalSale() {
  return (
    <CollectionSlider
      title="Final Sale"
      query={GET_PRODUCTS}
      variables={{ first: 12 }}
    />
  );
}
