import { Outlet } from "react-router-dom";
import StickyHeader from "../components/StickyHeader";
import Footer from "../components/Footer";
import CookieConsent from "../components/CookieConsent";
import FooterSpacer from "../components/FooterSpacer";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <StickyHeader />

      <main className="flex-1  relative z-20">
        <Outlet />
        <FooterSpacer />   {/* ⭐ IMPORTANT */}
      </main>

      <Footer />
      <CookieConsent />
    </div>
  );
}
