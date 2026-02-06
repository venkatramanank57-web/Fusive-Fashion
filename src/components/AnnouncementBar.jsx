// =====================================
// src/components/AnnouncementBar.jsx
// PURPOSE:
// - Top announcement bar
// - Black background, white text
// - Marquee scrolling text
// - Close (X) button on RIGHT side
// - Tailwind CSS ONLY
// =====================================

import { useState } from "react";
import { X } from "lucide-react";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative w-full overflow-hidden bg-black text-white border-b border-white/10 py-2 z-40">
      {/* Marquee Container */}
      <div className="flex whitespace-nowrap">
        {/* Animated marquee content */}
        <div className="animate-marquee flex items-center">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center mx-8">
              <a
                href="#"
                className="font-medium hover:underline whitespace-nowrap"
              >
                Black Friday Sale →
              </a>
              <span className="mx-8 opacity-90 whitespace-nowrap">
                Free returns within 30 days
              </span>
            </div>
          ))}
        </div>
        
        {/* Duplicate for seamless loop */}
        <div className="animate-marquee flex items-center" aria-hidden="true">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center mx-8">
              <a
                href="#"
                className="font-medium hover:underline whitespace-nowrap"
              >
                Black Friday Sale →
              </a>
              <span className="mx-8 opacity-90 whitespace-nowrap">
                Free returns within 30 days
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Close Button - RIGHT SIDE */}
      <button
        onClick={() => setVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-1 text-white hover:bg-white/10 rounded-md transition-colors"
        aria-label="Close announcement"
      >
        <X size={18} />
      </button>
    </div>
  );
}