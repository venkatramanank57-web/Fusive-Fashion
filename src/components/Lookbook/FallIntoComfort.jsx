import CollectionSlider from "../common/CollectionSlider";
import {GET_BESTSELLERS } from "../../api/shopify/bestsellerCollection";

export default function FallIntoComfort() {
  return (
    <CollectionSlider
      title="fall into comfort"
      query={GET_BESTSELLERS}
      variables={{ first: 12 }}
    />
  );
}
