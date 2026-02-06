// =====================================
// src/components/Toast.jsx
// PURPOSE:
// Toast notification component
// Shows success/error/info messages
// Auto-dismiss after 3 seconds
// =====================================

import { CheckCircle, XCircle, Info, X } from "lucide-react";

export default function Toast({ show, message, type = "success", onClose }) {
  if (!show) return null;

  const typeConfig = {
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-800",
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      icon: <XCircle className="w-5 h-5 text-red-500" />,
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-800",
      icon: <Info className="w-5 h-5 text-blue-500" />,
    },
  };

  const config = typeConfig[type] || typeConfig.success;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`${config.bg} ${config.border} border rounded-lg shadow-lg max-w-md`}>
        <div className="flex items-start p-4">
          <div className="flex-shrink-0 mr-3">
            {config.icon}
          </div>
          <div className="flex-1">
            <div className={`text-sm font-medium ${config.text}`}>
              {message}
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}