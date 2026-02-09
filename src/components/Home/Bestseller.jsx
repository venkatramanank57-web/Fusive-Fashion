import CollectionSlider from "../common/CollectionSlider";
import {GET_BESTSELLERS } from "../../api/shopify/bestsellerCollection";

export default function BestSeller() {
  return (
    <CollectionSlider
      title="Our Bestseller"
      query={GET_BESTSELLERS}
      variables={{ first: 12 }}
    />
  );
}
