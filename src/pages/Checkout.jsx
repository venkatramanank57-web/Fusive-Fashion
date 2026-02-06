// =====================================
// src/pages/Checkout.jsx
// PURPOSE:
// This page REDIRECTS USER TO SHOPIFY CHECKOUT.
// Actual payment is handled completely by Shopify.
// =====================================

import { useSelector } from "react-redux";

export default function Checkout() {
  const checkoutUrl = useSelector((state) => state.cart.checkoutUrl);

  if (!checkoutUrl) {
    return <p className="p-6">Checkout not ready</p>;
  }

  window.location.href = checkoutUrl;
  return null;
}
