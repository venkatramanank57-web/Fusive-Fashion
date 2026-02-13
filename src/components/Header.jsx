// =====================================
// src/components/Header.jsx
// =====================================

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ShoppingBag, User, Menu, X, Search, Heart, Plus, Minus, Globe } from "lucide-react";
import { useSearch } from "../context/SearchContext"; // 👈 IMPORT SEARCH CONTEXT

export default function Header() {
  const { openSearch } = useSearch(); // 👈 USE SEARCH CONTEXT
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [openAccordions, setOpenAccordions] = useState([]);
  
  // 🔥 REMOVED: isSearchOpen, searchQuery, setSearchQuery
  // 🔥 REMOVED: handleSearch, toggleSearch
  // 🔥 REMOVED: search overlay JSX block
  
  // NEW: State for scroll behavior
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);

  // Get cart items count from Redux store
  const cartCount = useSelector((state) => state.cart.items.length);
  
  // Get wishlist items count from Redux store
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const wishlistCount = wishlistItems.length;
  
  // Get customer login token
  const token = useSelector((state) => state.customer.token);

  const navigate = useNavigate();

  // NEW: Refs to track if menus are open
  const isMenuOpenRef = useRef(false);

  // 🔥 REMOVED: useEffect for body scroll lock (now handled in SearchContext)

  // Update ref when any menu opens
  useEffect(() => {
    isMenuOpenRef.current = isMobileMenuOpen || isDesktopMenuOpen;
  }, [isMobileMenuOpen, isDesktopMenuOpen]);

  // NEW: Scroll handling effect
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingUp = currentScrollY < lastScrollY;
      const scrolledPastThreshold = currentScrollY > 100;
      
      // Check if at top of page (for announcement bar compatibility)
      setIsAtTop(currentScrollY <= 10);

      // Don't hide/show header when menus are open
      if (isMenuOpenRef.current) {
        setLastScrollY(currentScrollY);
        return;
      }

      // Always show header when scrolling up
      if (scrollingUp) {
        setIsVisible(true);
      }
      // Hide header when scrolling down past threshold
      else if (scrolledPastThreshold && !scrollingUp) {
        setIsVisible(false);
      }
      // Show header when at top of page
      else if (currentScrollY <= 10) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    // Initial check for announcement bar
    setIsAtTop(window.scrollY <= 10);
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [lastScrollY]);

  // Menu items structure
  const menuItems = [
    {
      title: "Clothing",
      hasSubmenu: true,
      subItems: [
        { label: "View All", path: "/collections/clothing" },
        { label: "Denim", path: "/collections/denim" },
        { label: "Printed", path: "/collections/printed" },
        { label: "Solids", path: "/collections/solids" },
        { label: "Bodycon", path: "/collections/bodycon" },
      ]
    },
    {
      title: "Bestsellers",
      hasSubmenu: true,
      subItems: [
        { label: "Mini Bag", path: "/products/mini-bag" },
        { label: "Summer Dress", path: "/products/summer-dress" },
        { label: "Black Handbag", path: "/products/black-handbag" },
      ]
    },
    {
      title: "Sale",
      path: "/collections/sale",
      hasSubmenu: false,
    },
    {
      title: "New Arrivals",
      path: "/collections/new-arrivals",
      hasSubmenu: false,
    },
    {
      title: "Lookbook",
      path: "/lookbook",
      hasSubmenu: false,
    },
    {
      title: "About Us",
      path: "/about",
      hasSubmenu: false,
    },
  ];

  const bottomMenuItems = [
    { title: "Login / Register", path: token ? "/account" : "/login" },
    { title: "FAQ", path: "/faq" },
    { title: "Contact", path: "/contact" },
  ];

  const toggleAccordion = (title) => {
    if (openAccordions.includes(title)) {
      setOpenAccordions(openAccordions.filter(item => item !== title));
    } else {
      setOpenAccordions([...openAccordions, title]);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      setOpenAccordions([]);
    }
  };

  const toggleDesktopMenu = () => {
    setIsDesktopMenuOpen(!isDesktopMenuOpen);
    if (!isDesktopMenuOpen) {
      setOpenAccordions([]);
    }
  };

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsDesktopMenuOpen(false);
    setOpenAccordions([]);
  };

  // Close menu when clicking outside (for desktop)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDesktopMenuOpen && !event.target.closest('.desktop-menu-drawer') && !event.target.closest('.hamburger-button')) {
        setIsDesktopMenuOpen(false);
        setOpenAccordions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDesktopMenuOpen]);

  // 👇 ADD THIS: Search click handler using global context
  const handleSearchClick = () => {
    openSearch();
  };

  return (
    <>
      {/* 🔥 HEADER - stays at top */}
      <header className={`sticky top-0 z-50 bg-white border-b border-gray-100 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
      
        {/* Main Header */}
        <div className="px-4">
          {/* MOBILE HEADER */}
          <div className="lg:hidden flex items-center justify-between h-16">
            {/* LEFT SIDE: Hamburger + Search + Wishlist */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md text-gray-700 hover:text-black"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <button
                onClick={handleSearchClick} // 👈 UPDATED
                className="p-2 rounded-full text-gray-700 hover:text-black"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              <button
                onClick={() => navigate("/wishlist")}
                className="relative p-2 rounded-full text-gray-700 hover:text-red-500"
                aria-label="Wishlist"
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>
            </div>

            {/* CENTER: Brand Name */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <Link to="/" className="flex items-center">
                <span className="text-lg font-bold text-gray-900 whitespace-nowrap">
                  Fusive
                </span>
              </Link>
            </div>

            {/* RIGHT SIDE: Account + Cart */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate(token ? "/account" : "/login")}
                className="p-2 rounded-full text-gray-700 hover:text-black"
                aria-label={token ? "Account" : "Login"}
              >
                <User size={20} />
              </button>

              <Link
                to="/cart"
                className="relative p-2 rounded-full text-gray-700 hover:text-black"
                aria-label="Cart"
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* DESKTOP HEADER */}
          <div className="hidden lg:block">
            <div className="flex items-center justify-between h-20">
              {/* Desktop: Left Side - Hamburger */}
              <div className="flex items-center space-x-8">
                <button
                  onClick={toggleDesktopMenu}
                  className="hamburger-button p-2 rounded-md text-gray-700 hover:text-black"
                  aria-label="Menu"
                >
                  <Menu size={24} />
                </button>
                
                <Link
                  to="/collections/clothing"
                  className="text-sm font-medium text-gray-700 hover:text-black relative group"
                >
                  Clothing
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link
                  to="/collections/sale"
                  className="text-sm font-medium text-red-600 hover:text-red-700 font-semibold relative group"
                >
                  Sale
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </div>

              {/* Desktop: Center - Brand Name */}
              <div className="absolute left-1/2 transform -translate-x-1/2">
                <Link to="/" className="flex items-center">
                  <span className="text-2xl font-bold text-gray-900">
                    Fusive Fashion
                  </span>
                </Link>
              </div>

              {/* Desktop: Right Side */}
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-medium text-gray-700">INR</span>
                  <span className="text-xs text-gray-500">▼</span>
                </div>

                <button
                  onClick={handleSearchClick} // 👈 UPDATED
                  className="p-2 rounded-full text-gray-700 hover:text-black"
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>

                <button
                  onClick={() => navigate("/wishlist")}
                  className="relative p-2 rounded-full text-gray-700 hover:text-red-500"
                  aria-label="Wishlist"
                >
                  <Heart size={20} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => navigate(token ? "/account" : "/login")}
                  className="flex items-center gap-2 p-2 rounded-full text-gray-700 hover:text-black"
                >
                  <User size={20} />
                  <span className="text-sm font-medium relative inline-block group">
                    {token ? "Account" : "Login"}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </button>

                <Link
                  to="/cart"
                  className="relative p-2 rounded-full text-gray-700 hover:text-black"
                >
                  <ShoppingBag size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>

          {/* DESKTOP MENU DRAWER (Left Side - Divided Navigation) */}
          {isDesktopMenuOpen && (
            <>
              {/* Drawer Menu - KEPT ORIGINAL WIDTH FOR DESKTOP */}
              <div className="desktop-menu-drawer fixed inset-y-0 left-0 w-96 bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-2xl">
                {/* Drawer Header with FULL WIDTH border bottom */}
                <div className="flex items-center justify-between pt-6 border-b border-gray-300">
                  <span className="text-xl font-bold text-gray-900">Fusive Fashion</span>
                  <button
                    onClick={closeAllMenus}
                    className="p-2 rounded-full text-gray-500 hover:text-black"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Scrollable Menu Content */}
                <div className="h-[calc(100vh-73px)] overflow-y-auto bg-white">
                  {/* Main Menu Items with Divided Lines */}
                  <div className="py-4">
                    {menuItems.map((item, index) => (
                      <div key={index} className="relative">
                        {item.hasSubmenu ? (
                          <>
                            {/* Accordion Header */}
                            <div className="px-6 py-4">
                              <button
                                onClick={() => toggleAccordion(item.title)}
                                className="w-full flex items-center justify-between text-left relative group"
                              >
                                <div className="flex items-center relative">
                                  <span className="font-medium text-gray-900 group-hover:text-black transition-colors relative inline-block">
                                    {item.title}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                                  </span>
                                </div>
                                <span className="text-gray-400">
                                  {openAccordions.includes(item.title) ? (
                                    <Minus size={18} />
                                  ) : (
                                    <Plus size={18} />
                                  )}
                                </span>
                              </button>
                            </div>
                            
                            {/* Accordion Content - REMOVED BACKGROUND COLOR */}
                            {openAccordions.includes(item.title) && (
                              <div className="mx-6 mb-2">
                                {item.subItems.map((subItem, subIndex) => (
                                  <Link
                                    key={subIndex}
                                    to={subItem.path}
                                    onClick={closeAllMenus}
                                    className="block px-2 py-3 text-gray-600 hover:text-black transition-colors"
                                  >
                                    <div className="flex items-center relative group">
                                      <span className="relative inline-block">
                                        {subItem.label}
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                                      </span>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            )}
                            
                            {/* DIVIDER LINE */}
                            <div className="px-6">
                              <hr className="border-t border-gray-200" />
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Regular Menu Item */}
                            <div className="px-6 py-4">
                              <Link
                                to={item.path}
                                onClick={closeAllMenus}
                                className="block font-medium text-gray-900 hover:text-black transition-colors"
                              >
                                <span className="relative inline-block group">
                                  {item.title}
                                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                                </span>
                              </Link>
                            </div>
                            
                            {/* DIVIDER LINE */}
                            <div className="px-6">
                              <hr className="border-t border-gray-200" />
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Bottom Menu Items */}
                  <div className="py-4 border-t border-gray-300">
                    <div className="space-y-0">
                      {bottomMenuItems.map((item, index) => (
                        <div key={index} className="relative">
                          {/* Menu Item */}
                          <div className="px-6 py-4">
                            <Link
                              to={item.path}
                              onClick={closeAllMenus}
                              className="block text-gray-700 hover:text-black transition-colors"
                            >
                              <span className="relative inline-block group">
                                {item.title}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                              </span>
                            </Link>
                          </div>
                          
                          {/* DIVIDER LINE (except for last item) */}
                          {index < bottomMenuItems.length - 1 && (
                            <div className="px-6">
                              <hr className="border-t border-gray-200" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Country & Currency Section */}
                    <div className="mt-4">
                      <div className="relative">
                        {/* Content */}
                        <div className="px-6 py-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Globe size={18} className="text-gray-500 mr-3" />
                              <div>
                                <p className="font-medium text-gray-900">INDIA | INR</p>
                                <p className="text-sm text-gray-500">Change country/region</p>
                              </div>
                            </div>
                            <span className="text-2xl">🌍</span>
                          </div>
                        </div>
                        
                        {/* DIVIDER LINE (last line) */}
                        <div className="px-6">
                          <hr className="border-t border-gray-200" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* MOBILE MENU DRAWER */}
          {isMobileMenuOpen && (
            <>
              {/* Drawer Menu - FULL WIDTH FOR MOBILE */}
              <div className="fixed inset-0 bg-white z-50 lg:hidden">
                {/* Drawer Header with FULL WIDTH border bottom */}
                <div className="flex items-center justify-between pt-6 border-b border-gray-300">
                  <span className="text-xl font-bold text-gray-900">Fusive Fashion</span>
                  <button
                    onClick={closeAllMenus}
                    className="p-2 rounded-full text-gray-500 hover:text-black"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Scrollable Menu Content */}
                <div className="h-[calc(100vh-73px)] overflow-y-auto bg-white">
                  {/* Main Menu Items */}
                  <div className="py-4">
                    {menuItems.map((item, index) => (
                      <div key={index} className="relative">
                        {item.hasSubmenu ? (
                          <>
                            {/* Accordion Header */}
                            <div className="px-6 py-4">
                              <button
                                onClick={() => toggleAccordion(item.title)}
                                className="w-full flex items-center justify-between text-left relative group"
                              >
                                <div className="flex items-center relative">
                                  <span className="font-medium text-gray-900 group-hover:text-black transition-colors relative inline-block">
                                    {item.title}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                                  </span>
                                </div>
                                <span className="text-gray-400">
                                  {openAccordions.includes(item.title) ? (
                                    <Minus size={18} />
                                  ) : (
                                    <Plus size={18} />
                                  )}
                                </span>
                              </button>
                            </div>
                            
                            {/* Accordion Content - REMOVED BACKGROUND COLOR */}
                            {openAccordions.includes(item.title) && (
                              <div className="mx-6 mb-2">
                                {item.subItems.map((subItem, subIndex) => (
                                  <Link
                                    key={subIndex}
                                    to={subItem.path}
                                    onClick={closeAllMenus}
                                    className="block px-2 py-3 text-gray-600 hover:text-black transition-colors"
                                  >
                                    <div className="flex items-center relative group">
                                      <span className="relative inline-block">
                                        {subItem.label}
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                                      </span>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            )}
                            
                            {/* DIVIDER LINE */}
                            <div className="px-6">
                              <hr className="border-t border-gray-200" />
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Regular Menu Item */}
                            <div className="px-6 py-4">
                              <Link
                                to={item.path}
                                onClick={closeAllMenus}
                                className="block font-medium text-gray-900 hover:text-black transition-colors"
                              >
                                <span className="relative inline-block group">
                                  {item.title}
                                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                                </span>
                              </Link>
                            </div>
                            
                            {/* DIVIDER LINE */}
                            <div className="px-6">
                              <hr className="border-t border-gray-200" />
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Bottom Menu Items */}
                  <div className="py-4 border-t border-gray-300">
                    <div className="space-y-0">
                      {bottomMenuItems.map((item, index) => (
                        <div key={index} className="relative">
                          {/* Menu Item */}
                          <div className="px-6 py-4">
                            <Link
                              to={item.path}
                              onClick={closeAllMenus}
                              className="block text-gray-700 hover:text-black transition-colors"
                            >
                              <span className="relative inline-block group">
                                {item.title}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                              </span>
                            </Link>
                          </div>
                          
                          {/* DIVIDER LINE (except for last item) */}
                          {index < bottomMenuItems.length - 1 && (
                            <div className="px-6">
                              <hr className="border-t border-gray-200" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Country & Currency Section */}
                    <div className="mt-4">
                      <div className="relative">
                        {/* Content */}
                        <div className="px-6 py-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Globe size={18} className="text-gray-500 mr-3" />
                              <div>
                                <p className="font-medium text-gray-900">INDIA | INR</p>
                                <p className="text-sm text-gray-500">Change country/region</p>
                              </div>
                            </div>
                            <span className="text-2xl">🌍</span>
                          </div>
                        </div>
                        
                        {/* DIVIDER LINE (last line) */}
                        <div className="px-6">
                          <hr className="border-t border-gray-200" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      {/* 🔥 REMOVED: FULL SCREEN SEARCH OVERLAY - Now handled at root level in App.jsx */}
    </>
  );
}