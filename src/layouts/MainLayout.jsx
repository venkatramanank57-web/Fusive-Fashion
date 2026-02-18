// MainLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import StickyHeader from "../components/StickyHeader";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";

export default function MainLayout() {
  const [isReady, setIsReady] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Page load aagumpodhu oru micro-delay
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1200); // 1.2 seconds safe for home loading
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <StickyHeader />

      <main className="flex-grow relative z-20">
        <Outlet />
      </main>

      {/* ⭐ Footer reserve height: Jump aaguradha thadukkum */}
      <div className="min-h-[300px] w-full">
         {isReady && <Footer />}
      </div>
    </div>
  );
}