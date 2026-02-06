import { useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Pin, ChevronDown, ChevronUp } from "lucide-react";
import { useSelector } from "react-redux";

export default function Footer() {
  const token = useSelector((state) => state.customer.token);
  const [openSections, setOpenSections] = useState({
    products: false,
    service: false,
    information: false,
    about: false
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // CSS classes
  const navLinkStyle = "inline-block text-gray-700 hover:text-black transition-colors duration-300";
  const underlineStyle = "relative after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full";
  const socialIconStyle = "text-gray-700 hover:text-black transition-colors duration-300";
  const paymentIconStyle = "h-8 w-12 object-contain";

  const footerSections = [
    {
      id: "products",
      title: "Products",
      links: [
        { label: "View All", path: "/collections/clothing" },
        { label: "Denim", path: "/collections/denim" },
        { label: "Printed", path: "/collections/printed" },
        { label: "Solids", path: "/collections/solids" },
        { label: "Bodycon", path: "/collections/bodycon" },
      ]
    },
    {
      id: "service",
      title: "Service",
      links: [
        { label: "Login / Register", path: token ? "/account" : "/login" },
        { label: "FAQ", path: "/faq" },
        { label: "Contact", path: "/contact" },
        { label: "Theme Features", path: "/theme-features" },
      ]
    },
    {
      id: "information",
      title: "Information",
      links: [
        { label: "About Us", path: "/about" },
        { label: "Return and Refunds", path: "/returns" },
        { label: "Legal Area", path: "/legal" },
        { label: "Privacy Policy", path: "/privacy" },
        { label: "Terms of Service", path: "/terms" },
      ]
    },
    {
      id: "about",
      title: "About Us",
      content: (
        <p className="text-gray-700 text-sm md:text-base">
          We could not have created this demo without the help of an amazing 
          source of content and products. Visit our{" "}
          <Link 
            to="/about" 
            className={`${navLinkStyle} ${underlineStyle} font-medium`}
          >
            about page
          </Link>{" "}
          to find out where all the products used in this demo came from.
        </p>
      )
    }
  ];

  const socialLinks = [
    { icon: Facebook, label: "Facebook", href: "#" },
    { icon: Twitter, label: "Twitter", href: "#" },
    { icon: Instagram, label: "Instagram", href: "#" },
    { icon: Pin, label: "Pinterest", href: "#" },
  ];

  const paymentMethods = [
    { src: "/payments/visa.png", alt: "Visa" },
    { src: "/payments/mastercard.png", alt: "Mastercard" },
    { src: "/payments/amex.png", alt: "American Express" },
    { src: "/payments/paypal.png", alt: "PayPal" },
    { src: "/payments/discover.png", alt: "Discover" },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 z-10">
      
      {/* ===== MOBILE VIEW ===== */}
      <div className="md:hidden">
        {/* Language Selector */}
        <div className="px-4 py-4 border-b border-gray-200">
          <div className="flex items-center justify-end">
            <button className="text-sm font-medium text-gray-700 hover:text-black flex items-center gap-1">
              EN <ChevronDown size={14} />
            </button>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="px-4 py-4 border-b border-gray-200">
          <div className="flex items-center justify-center gap-6">
            {socialLinks.map((social, index) => (
              <a 
                key={index}
                href={social.href} 
                aria-label={social.label}
                className={socialIconStyle}
              >
                <social.icon size={20} />
              </a>
            ))}
          </div>
        </div>

        {/* Accordion Sections */}
        <div className="border-b border-gray-200">
          {footerSections.map((section) => (
            <div key={section.id} className="border-b border-gray-200 last:border-b-0">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-4 py-5 flex items-center justify-between text-left hover:bg-gray-50"
              >
                <span className="text-sm font-semibold tracking-wide uppercase">
                  {section.title}
                </span>
                <span className="text-gray-500 text-lg font-light">
                  {openSections[section.id] ? "−" : "+"}
                </span>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ${
                openSections[section.id] ? 'max-h-96' : 'max-h-0'
              }`}>
                <div className="px-4 pb-5">
                  {section.links ? (
                    <ul className="space-y-3">
                      {section.links.map((link, index) => (
                        <li key={index}>
                          <Link 
                            to={link.path} 
                            className={`${navLinkStyle} ${underlineStyle} text-sm`}
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    section.content
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Icons */}
        <div className="px-4 py-6 border-b border-gray-200">
          <div className="flex items-center justify-center gap-4">
            {paymentMethods.map((payment, index) => (
              <img 
                key={index}
                src={payment.src} 
                alt={payment.alt} 
                className={paymentIconStyle}
              />
            ))}
          </div>
        </div>

        {/* Brand Logo - Mobile */}
        <div className="text-center py-10">
          <Link to="/">
            <h1 className="text-5xl font-black tracking-[0.15em] text-gray-900">
              FUSIVE
            </h1>
          </Link>
        </div>
      </div>

      {/* ===== DESKTOP VIEW ===== */}
      <div className="hidden md:block">
        {/* Desktop Grid Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Main Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-14">
            {footerSections.map((section) => (
              <div key={section.id} className="group">
                <h3 className="text-sm tracking-[0.25em] font-semibold mb-6 uppercase transition-all duration-300 group-hover:tracking-[0.3em]">
                  {section.title}
                </h3>
                {section.links ? (
                  <ul className="space-y-3 md:space-y-4">
                    {section.links.map((link, index) => (
                      <li key={index}>
                        <Link 
                          to={link.path} 
                          className={`${navLinkStyle} ${underlineStyle} text-sm md:text-base`}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="group">
                    {section.content}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom Section with Language, Social & Payments */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              {/* Language Selector + Social Icons */}
              <div className="flex items-center gap-6 text-gray-800">
                <div className="relative group">
                  <button className="font-medium px-3 py-1.5 rounded-lg transition-all duration-300 hover:bg-white hover:shadow-sm hover:-translate-y-0.5">
                    EN ▾
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  {socialLinks.map((social, index) => (
                    <a 
                      key={index}
                      href={social.href} 
                      aria-label={social.label}
                      className="relative inline-block text-gray-800 hover:text-black transition-all duration-300 hover:scale-110"
                    >
                      <social.icon size={20} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Payment Icons */}
              <div className="flex gap-3">
                {paymentMethods.map((payment, index) => (
                  <img 
                    key={index}
                    src={payment.src} 
                    alt={payment.alt} 
                    className="h-6 transition-all duration-300 hover:scale-110 hover:drop-shadow-md cursor-pointer"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Large Full Width Brand Logo - Desktop */}
        <div className="w-full text-center py-20 bg-[#f5f5f5] mt-12">
          <Link to="/">
            <h1 className="text-[220px] font-black tracking-[0.25em] text-gray-900 transition-all duration-500 hover:tracking-[0.35em] hover:opacity-90">
              FUSIVE
            </h1>
          </Link>
          
          {/* Copyright */}
          <div className="mt-8 text-gray-600 text-sm">
            <p>© {new Date().getFullYear()} Fusive. All rights reserved.</p>
            <p className="mt-2 text-xs text-gray-500">
              Made with <span className="text-red-500">♥</span> by your team
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Copyright */}
      <div className="md:hidden border-t border-gray-200 py-4 text-center">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} Fusive. All rights reserved.
        </p>
      </div>
    </footer>
  );
}