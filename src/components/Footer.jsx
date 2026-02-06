// =====================================
// src/components/Footer.jsx
// PURPOSE:
// This footer PROVIDES LEGAL & POLICY LINKS.
// Links to our React pages that fetch from Shopify API.
// =====================================

import { Link } from "react-router-dom";
import { Shield, FileText, RefreshCw, Truck, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-baltic text-dawn px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Policy Links Section */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
          {[
            {
              to: "/policy/privacy",
              label: "Privacy Policy",
              icon: Shield,
              description: "Your data protection"
            },
            {
              to: "/policy/terms",
              label: "Terms of Service",
              icon: FileText,
              description: "Terms & conditions"
            },
            {
              to: "/policy/refund",
              label: "Refund Policy",
              icon: RefreshCw,
              description: "Returns & refunds"
            },
            {
              to: "/policy/shipping",
              label: "Shipping Policy",
              icon: Truck,
              description: "Delivery information"
            },
            {
              to: "/contact",
              label: "Contact Us",
              icon: Mail,
              description: "Get in touch"
            },
          ].map((item) => (
            <div key={item.to} className="text-center">
              <Link
                to={item.to}
                className="inline-flex flex-col items-center gap-2 group"
              >
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <item.icon className="h-5 w-5 text-dawn" />
                </div>
                <span className="text-sm font-medium group-hover:text-white transition-colors">
                  {item.label}
                </span>
                <p className="text-xs text-dawn/80 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.description}
                </p>
              </Link>
            </div>
          ))}
        </div>

        {/* Shopify Sync Status */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full">
            <span className="text-xs">🔄</span>
            <span className="text-xs">Synced with Shopify</span>
            <span className="text-xs opacity-70">•</span>
            <span className="text-xs">Auto-updates enabled</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center border-t border-white/20 pt-6">
          <p className="text-sm">
            © {new Date().getFullYear()} Venkat Store. All rights reserved.
          </p>
          <p className="text-xs mt-2 opacity-80">
            Policies automatically fetched from Shopify • 
            API: {import.meta.env.VITE_SHOPIFY_API_VERSION} • 
            Last sync: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Shopify Admin Link (Optional) */}
        <div className="text-center mt-4">
          <a
            href={`https://${import.meta.env.VITE_SHOPIFY_DOMAIN}/admin/settings/legal`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs opacity-70 hover:opacity-100 transition-opacity inline-flex items-center gap-1"
          >
            Edit policies in Shopify Admin
            <span>↗</span>
          </a>
        </div>
      </div>
    </footer>
  );
}