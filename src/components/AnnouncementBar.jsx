// =====================================
// src/components/AnnouncementBar.jsx (ALWAYS SHOW ON RELOAD)
// =====================================

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true); // ALWAYS start as true

  useEffect(() => {
    console.log("AnnouncementBar mounted on page load/reload");
    
    // IGNORE sessionStorage - always show on load
    // Delete any existing session storage to prevent future issues
    sessionStorage.removeItem("announcementClosed");
    
    // Force set to true (just in case)
    setVisible(true);
  }, []);

  const closeBar = () => {
    console.log("User closed announcement bar");
    setVisible(false);
    
    // Still store in sessionStorage so it stays closed
    // during current page navigation (not on reload)
    sessionStorage.setItem("announcementClosed", "true");
  };

  // Reset on page reload
  useEffect(() => {
    // This will run before page unload/reload
    const handleBeforeUnload = () => {
      sessionStorage.removeItem("announcementClosed");
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  if (!visible) {
    console.log("AnnouncementBar not showing (user closed it)");
    return null;
  }

  console.log("AnnouncementBar is VISIBLE and rendering");

  return (
    <div className="relative w-full overflow-hidden bg-black text-white border-b border-white/10 py-2">
      <div className="flex whitespace-nowrap">
        <div className="animate-marquee flex items-center">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center mx-8">
              <span className="font-medium">
                Black Friday Sale →
              </span>
              <span className="mx-8 opacity-90">
                Free returns within 30 days
              </span>
            </div>
          ))}
        </div>

        <div className="animate-marquee flex items-center" aria-hidden="true">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center mx-8">
              <span className="font-medium">
                Black Friday Sale →
              </span>
              <span className="mx-8 opacity-90">
                Free returns within 30 days
              </span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={closeBar}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-white hover:bg-white/10 rounded-md"
        aria-label="Close announcement"
      >
        <X size={18} />
      </button>
    </div>
  );
}