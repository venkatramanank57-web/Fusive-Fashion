// =====================================
// src/routes/AppRoutes.jsx
// FINAL (SALE PAGE ONLY VERSION)
// =====================================

import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

// Scroll to top
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}

// Layout
import MainLayout from "../layouts/MainLayout";

// Pages
import Home from "../pages/Home";
import Sale from "../pages/Sale"; // ⭐ SALE PAGE
import ProductDetailPage from "../pages/ProductDeatilPage";
import CollectionPage from "../pages/CollectionPage";
import ShopByCollections from "../pages/ShopByCollections"
import SearchPage from "../pages/SearchPage";
import Cart from "../pages/Cart";
import WishlistPage from "../pages/WishlistPage";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Account from "../pages/Account";
import FAQPage from "../pages/FAQPage"
import About from "../pages/About";
import Lookbook from "../pages/Lookbook";
import Orders from "../pages/Orders";
import OrderSuccess from "../pages/OrderSuccess";
import Testpage from "../pages/testpage";

// Policy Pages
import PoliciesPage from "../pages/PolicyPages";
import ContactPage from "../pages/ContactPage";

// Route protection
import ProtectedRoutes from "./ProtectedRoute";


//NotFound Page
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          {/* HOME */}
          <Route path="/" element={<Home />} />

          {/* ⭐ SALE PAGE ROUTES */}
          <Route path="/collections/sale" element={<Sale />} />
          {/* <Route path="/sale" element={<Navigate to="/collections/sale" replace />} /> */}
          <Route path="/collections/:handle" element={<CollectionPage />} />


          {/*showing all collection*/}
          <Route path="/shop-by-collections" element={<ShopByCollections />} />

          {/* PRODUCT PAGE */}
          <Route path="/products/:handle" element={<ProductDetailPage />} />
          <Route path="/product/:handle" element={<ProductDetailPage />} />


          {/*search page*/}
          <Route path="/search" element={<SearchPage />} />

          {/* SHOPPING */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<WishlistPage />} />
         

 
          {/* look book page */}
          <Route path="/lookbook" element={<Lookbook />} /> 

          {/*About us page */}
          <Route path="/about" element={<About />} />



          {/* AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* POLICIES */}
          <Route path="/policy/:type" element={<PoliciesPage />} />
          {/* <Route path="/contact" element={<ContactPage />} /> */}

          {/*Fqa page*/}
          {/* <Route path="/faq" element={<FAQPage />} /> */}
{/* 
          <Route
            path="/privacy-policy"
            element={<Navigate to="/policy/privacy" replace />}
          />
          <Route
            path="/refund-policy"
            element={<Navigate to="/policy/refund" replace />}
          />
          <Route
            path="/terms-of-service"
            element={<Navigate to="/policy/terms" replace />}
          />
          <Route
            path="/shipping-policy"
            element={<Navigate to="/policy/shipping" replace />}
          />
          <Route
            path="/return-policy"
            element={<Navigate to="/policy/refund" replace />}
          /> */}

          {/* PROTECTED */}
          <Route element={<ProtectedRoutes />}>
            <Route path="/account" element={<Account />} />
            <Route path="/orders" element={<Orders />} />
          </Route>

          {/* ORDER SUCCESS */}
          <Route path="/success" element={<OrderSuccess />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/test" element={<Testpage />} />

          
          {/* <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center relative z-10 bg-white" >
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-gray-600 mb-8">Page not found</p>
                  <a href="/" className="text-baltic hover:underline">
                    Return to Home
                  </a>
                </div>
              </div>
            }
          /> */}

          {/* Not found page */}
          {/* ⭐ 404 LAST */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
