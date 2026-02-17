import { useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Pin, ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";

export default function Footer() {
  const token = useSelector((state) => state.customer.token);

  const [openSections, setOpenSections] = useState({
    products: false,
    service: false,
    information: false,
    about: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  /* ================= STYLES ================= */
  const navLinkStyle =
    "inline-block text-gray-700 hover:text-black transition-colors duration-300";

  const underlineStyle =
    "relative after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full";

  const socialIconStyle =
    "text-gray-700 hover:text-black transition-colors duration-300";

  const paymentIconStyle = "h-8 w-12 object-contain";

  /* ================= DATA ================= */
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
      ],
    },
    {
      id: "service",
      title: "Service",
      links: [
        { label: "Login / Register", path: token ? "/account" : "/login" },
        { label: "FAQ", path: "/faq" },
        { label: "Contact", path: "/contact" },
        { label: "Theme Features", path: "/theme-features" },
      ],
    },
    {
      id: "information",
      title: "Information",
      links: [
        { label: "About Us", path: "/about" },
        { label: "Return and Refunds", path: "/policy/refund" },
        { label: "Legal Area", path: "/policy/legal" },
        { label: "Privacy Policy", path: "/policy/privacy" },
        { label: "Terms of Service", path: "/policy/terms" },
      ],
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
      ),
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Instagram, href: "#" },
    { icon: Pin, href: "#" },
  ];

  const paymentMethods = [
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg",
      alt: "Visa",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
      alt: "Mastercard",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg",
      alt: "American Express",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg",
      alt: "PayPal",
    },
    {
      src: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/discover.svg",
      alt: "Discover",
    },
  ];

  return (
    <footer className="md:fixed md:bottom-0 md:left-0 w-full md:z-10 md:pointer-events-none">
      <div className="bg-white border-t border-gray-200 md:pointer-events-auto">
        {/* ================= MOBILE ================= */}
        <div className="md:hidden">
          <div className="px-4 py-4 border-b flex justify-end">
            <button className="text-sm font-medium flex items-center gap-1">
              EN <ChevronDown size={14} />
            </button>
          </div>

          <div className="px-4 py-4 border-b flex justify-center gap-6">
            {socialLinks.map((s, i) => (
              <a key={i} href={s.href} className={socialIconStyle}>
                <s.icon size={20} />
              </a>
            ))}
          </div>

          <div className="border-b">
            {footerSections.map((section) => (
              <div key={section.id} className="border-b last:border-0">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-4 py-5 flex justify-between text-sm font-semibold uppercase"
                >
                  {section.title}
                  <span>{openSections[section.id] ? "−" : "+"}</span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openSections[section.id] ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <div className="px-4 pb-5">
                    {section.links ? (
                      <ul className="space-y-3">
                        {section.links.map((l, i) => (
                          <li key={i}>
                            <Link
                              to={l.path}
                              className={`${navLinkStyle} ${underlineStyle} text-sm`}
                            >
                              {l.label}
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

          <div className="px-4 py-6 border-b flex justify-center gap-4">
            {paymentMethods.map((p, i) => (
              <img key={i} src={p.src} alt={p.alt} className={paymentIconStyle} />
            ))}
          </div>

          <div className="text-center py-10">
            <h1 className="text-5xl font-black tracking-[0.15em]">FUSIVE</h1>
          </div>

          <div className="border-t py-4 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Fusive. All rights reserved.
          </div>
        </div>

        {/* ================= DESKTOP ================= */}
        <div className="hidden md:block">
          <div className="max-w-7xl mx-auto px-6 pt-12 pb-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-14">
              {footerSections.map((section) => (
                <div key={section.id} className="group">
                  <h3
                    className="
                      text-sm
                      tracking-[0.25em]
                      font-semibold
                      mb-6
                      uppercase
                      transition-[letter-spacing]
                      duration-300
                      group-hover:tracking-[0.3em]
                    "
                  >
                    {section.title}
                  </h3>

                  {section.links ? (
                    <ul className="space-y-4">
                      {section.links.map((l, i) => (
                        <li key={i}>
                          <Link
                            to={l.path}
                            className={`${navLinkStyle} ${underlineStyle}`}
                          >
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    section.content
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t flex justify-between">
              <div className="flex gap-6 items-center">
                <button className="font-medium">EN ▾</button>
                <div className="flex gap-4">
                  {socialLinks.map((s, i) => (
                    <s.icon key={i} size={20} />
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                {paymentMethods.map((p, i) => (
                  <img key={i} src={p.src} alt={p.alt} className="h-6" />
                ))}
              </div>
            </div>
          </div>

          {/* BRAND SECTION */}
          <div className="text-center">
            <h1
              className="
                text-[220px]
                leading-none
                font-black
                tracking-[0.25em]
                text-gray-900
                transition-[letter-spacing,opacity]
                duration-500
                hover:tracking-[0.35em]
                hover:opacity-90
              "
            >
              FUSIVE
            </h1>

            <div className="pt-4 pb-6 text-sm text-gray-600">
              <p>© {new Date().getFullYear()} Fusive. All rights reserved.</p>
              <p className="text-xs text-gray-500">
                Made with <span className="text-red-500">♥</span> by your team
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}