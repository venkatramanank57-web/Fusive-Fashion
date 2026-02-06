// =====================================
// src/components/CookieConsent.jsx
// PURPOSE:
// Shows cookie consent banner
// Stores user preferences in localStorage
// GDPR compliant
// =====================================

import { useState, useEffect } from "react";
import { X, Cookie, Check } from "lucide-react";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowBanner(true);
    } else {
      const savedPrefs = JSON.parse(consent);
      setPreferences(savedPrefs);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    setPreferences(allAccepted);
    localStorage.setItem("cookie-consent", JSON.stringify(allAccepted));
    setShowBanner(false);
    initializeCookies(allAccepted);
  };

  const handleAcceptSelected = () => {
    localStorage.setItem("cookie-consent", JSON.stringify(preferences));
    setShowBanner(false);
    initializeCookies(preferences);
  };

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    setPreferences(onlyNecessary);
    localStorage.setItem("cookie-consent", JSON.stringify(onlyNecessary));
    setShowBanner(false);
    initializeCookies(onlyNecessary);
  };

  const initializeCookies = (prefs) => {
    // Initialize analytics if accepted
    if (prefs.analytics) {
      console.log("Analytics cookies initialized");
      // Add Google Analytics or other tracking here
    }

    // Initialize marketing if accepted
    if (prefs.marketing) {
      console.log("Marketing cookies initialized");
      // Add Facebook Pixel or other marketing tools here
    }

    // Initialize preferences if accepted
    if (prefs.preferences) {
      console.log("Preference cookies initialized");
      // Store user preferences
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50">
      <div className="bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Left: Message */}
            <div className="flex items-start gap-4">
              <div className="hidden sm:flex">
                <Cookie className="w-6 h-6 text-baltic mt-1" />
              </div>
              <div>
                <p className="text-gray-900 font-medium mb-1">
                  We value your privacy
                </p>
                <p className="text-gray-600 text-sm">
                  We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                  By clicking "Accept All", you consent to our use of cookies.
                </p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <button
                onClick={handleRejectAll}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
              >
                Reject All
              </button>
              <button
                onClick={handleAcceptSelected}
                className="px-4 py-2 border border-baltic text-baltic text-sm rounded-lg hover:bg-baltic hover:text-white transition-colors"
              >
                Customize
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-4 py-2 bg-baltic text-white text-sm rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}