// ================================
// src/App.jsx
// ================================

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "./context/SearchContext";
import SearchOverlay from "./components/Search/SearchOverlay";
import AppRoutes from "./routes/AppRoutes";
import PageLoader from "./components/PageLoader";

// Wrapper component to provide navigate
function SearchOverlayWrapper() {
  const { isSearchOpen, searchQuery, setSearchQuery, closeSearch } = useSearch();
  const navigate = useNavigate();

  if (!isSearchOpen) return null;

  return (
    <SearchOverlay
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      closeSearch={closeSearch}
      navigate={navigate}
    />
  );
}

export default function App() {
  const [appReady, setAppReady] = useState(false);

  // ⭐ Initial app loader (fix footer flash)
  useEffect(() => {
    const timer = setTimeout(() => {
      setAppReady(true);
    }, 800); // smooth first paint

    return () => clearTimeout(timer);
  }, []);

  // show fullscreen loader until app ready
  if (!appReady) return <PageLoader />;

  return (
    <>
      <AppRoutes />
      <SearchOverlayWrapper />
    </>
  );
}
