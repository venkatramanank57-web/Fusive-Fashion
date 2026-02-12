// ================================
// src/context/SearchContext.jsx
// ================================

import { createContext, useContext, useState, useEffect } from "react";

const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Lock page scroll when search is open
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSearchOpen]);

  const openSearch = () => {
    setIsSearchOpen(true);
    setSearchQuery("");
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const value = {
    isSearchOpen,
    searchQuery,
    setSearchQuery,
    openSearch,
    closeSearch
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within SearchProvider");
  }
  return context;
}