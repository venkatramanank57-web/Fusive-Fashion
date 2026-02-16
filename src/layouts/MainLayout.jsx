// src/layouts/MainLayout.jsx

import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import StickyHeader from "../components/StickyHeader";
import Footer from "../components/Footer";
import CookieConsent from "../components/CookieConsent";
import PageLoader from "../components/PageLoader";

export default function MainLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-white">

      <StickyHeader />

      {/* ⭐ CRITICAL FIX */}
      <main className="flex-1 relative">
        <Suspense
          key={location.pathname}   // reset loader on route change
          fallback={
            <div className="absolute inset-0 flex items-center justify-center bg-white z-40">
              <PageLoader />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>

      <Footer />
      <CookieConsent />
    </div>
  );
}
