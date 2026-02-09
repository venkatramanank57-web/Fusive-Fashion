// =====================================
// src/layouts/MainLayout.jsx
// =====================================

import { Outlet } from "react-router-dom";
import StickyHeader from "../components/StickyHeader"; // Import the SUPER component
import Footer from "../components/Footer";
import CookieConsent from "../components/CookieConsent";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Use the SUPER component instead of separate components */}
      <StickyHeader />

      {/* Page-specific content */}
      <main className="flex-1 pb-[800px]">
        <Outlet />
      </main> 

      {/* Footer ALWAYS after page content */}
      <Footer />
      <CookieConsent />
    </div>
  );
}