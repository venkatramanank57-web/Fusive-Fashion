import CollectionSlider from "../common/CollectionSlider";
import {GET_PRODUCTS } from "../../api/shopify/products";

export default function SaleProductsSection() {
  return (
    <CollectionSlider
      title=""
      query={GET_PRODUCTS}
      variables={{ first: 12 }}
    />
  );
}
