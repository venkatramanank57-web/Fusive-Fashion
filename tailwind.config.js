// =====================================
// tailwind.config.js
// PURPOSE:
// - Global Tailwind configuration
// - Brand colors (Dawn, Leaf, Peace, Baltic)
// - Primary font (Jost)
// - All animations (Marquee, Shimmer, Pulse)
// - Brand logo marquee (NEW)
// =====================================

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      // 🎨 Brand Colors
      colors: {
        dawn: "#F1E8DF",
        leaf: "#C7AB62",
        peace: "#F2CCA7",
        baltic: "#282828",
      },

      // 🔤 Font
      fontFamily: {
        primary: ["Jost", "sans-serif"],
      },

      // 🎞️ ALL ANIMATIONS
      animation: {
        // Announcement bar marquee
        marquee: "marquee 60s linear infinite",
        marquee2: "marquee2 25s linear infinite",

        // ✅ Brand logo marquee (NEW)
        "brand-marquee": "brandMarquee 35s linear infinite",
        "brand-marquee-reverse": "brandMarqueeReverse 35s linear infinite",

        // Skeleton loaders
        shimmer: "shimmer 2s infinite linear",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-fast": "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",

        // Product cards
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",

        // Loading spinners
        "spin-slow": "spin 3s linear infinite",
        "bounce-slow": "bounce 2s infinite",
      },

      keyframes: {
        // Announcement marquee
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        marquee2: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0%)" },
        },

        // ✅ Brand logo marquee (NEW, -50% LOOP)
        brandMarquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        brandMarqueeReverse: {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },

        // Shimmer effect
        shimmer: {
          "0%": {
            backgroundPosition: "-1000px 0",
            transform: "translateX(-100%)",
          },
          "100%": {
            backgroundPosition: "1000px 0",
            transform: "translateX(100%)",
          },
        },

        // Pulse
        pulse: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },

        // Fade in
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },

        // Slide up
        slideUp: {
          "0%": { transform: "translateY(100%)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },

        // Slide down
        slideDown: {
          "0%": { transform: "translateY(-100%)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },

        // Bounce
        bounce: {
          "0%, 100%": {
            transform: "translateY(0)",
            animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateY(-25%)",
            animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
      },

      // Backgrounds
      backgroundImage: {
        "shimmer-gradient":
          "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
        "skeleton-gradient":
          "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
      },

      // Animation delays
      animationDelay: {
        "100": "100ms",
        "200": "200ms",
        "300": "300ms",
        "400": "400ms",
        "500": "500ms",
      },

      // Skeleton colors
      backgroundColor: {
        "skeleton-light": "#f5f5f5",
        "skeleton-dark": "#e5e5e5",
        "skeleton-highlight": "#fafafa",
      },

      backgroundSize: {
        "shimmer-size": "1000px 100%",
      },
    },
  },

  plugins: [
    // Animation delay utilities
    function ({ addUtilities, theme }) {
      const delays = theme("animationDelay");
      const utilities = {};

      Object.keys(delays).forEach((key) => {
        utilities[`.animation-delay-${key}`] = {
          animationDelay: delays[key],
        };
      });

      addUtilities(utilities);
    },

    // Skeleton utilities
    function ({ addComponents }) {
      addComponents({
        ".skeleton": {
          backgroundColor: "#f5f5f5",
          backgroundImage:
            "linear-gradient(90deg, #f5f5f5, #e5e5e5, #f5f5f5)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite",
        },
        ".skeleton-text": {
          height: "1rem",
          marginBottom: "0.5rem",
          borderRadius: "0.25rem",
          backgroundColor: "#f5f5f5",
        },
        ".skeleton-circle": {
          borderRadius: "50%",
          backgroundColor: "#f5f5f5",
        },
        ".skeleton-image": {
          width: "100%",
          aspectRatio: "1 / 1",
          backgroundColor: "#f5f5f5",
        },
      });
    },
  ],
};
