// =====================================
// src/layouts/MainLayout.jsx
// PURPOSE:
// - Global layout wrapper
// - Controls page structure order
// - Includes cookie consent banner
// =====================================

import { Outlet } from "react-router-dom";
import AnnouncementBar from "../components/AnnouncementBar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CookieConsent from "../components/CookieConsent";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <CookieConsent />
      <Footer />
    </div>
  );
}
