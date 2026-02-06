// =====================================
// src/layouts/MainLayout.jsx
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
        <Outlet /> {/* Page content render aagum */}
      </main>
      <Footer /> 
      <CookieConsent />
    </div>
  );
}