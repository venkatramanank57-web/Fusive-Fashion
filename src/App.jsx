// ================================
// src/App.jsx
// ================================

import { useNavigate } from "react-router-dom";
import { useSearch } from "./context/SearchContext";
import SearchOverlay from "./components/Search/SearchOverlay";
import AppRoutes from "./routes/AppRoutes";
// Remove this line: import { Toaster } from "react-hot-toast";

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
  return (
    <>
      {/* Remove this line: <Toaster position="top-right" /> */}
      <AppRoutes />
      <SearchOverlayWrapper />
    </>
  );
}