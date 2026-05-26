import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

    // Auto-remove toast after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full px-4 sm:px-0">
        {toasts.map((toast) => (
          <ToastCard
            key={toast.id}
            toast={toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastCard = ({ toast, onClose }) => {
  const { message, type } = toast;

  const styles = {
    success: {
      bg: "bg-emerald-50/90 border-emerald-200/60 shadow-emerald-100",
      text: "text-emerald-800",
      iconText: "text-emerald-500",
      Icon: CheckCircle2,
    },
    error: {
      bg: "bg-rose-50/90 border-rose-200/60 shadow-rose-100",
      text: "text-rose-800",
      iconText: "text-rose-500",
      Icon: AlertCircle,
    },
    warning: {
      bg: "bg-amber-50/90 border-amber-200/60 shadow-amber-100",
      text: "text-amber-800",
      iconText: "text-amber-500",
      Icon: AlertTriangle,
    },
    info: {
      bg: "bg-indigo-50/90 border-indigo-200/60 shadow-indigo-100",
      text: "text-indigo-800",
      iconText: "text-indigo-500",
      Icon: Info,
    },
  };

  const currentStyle = styles[type] || styles.info;
  const { Icon } = currentStyle;

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border glass-panel shadow-lg animate-slide-up ${currentStyle.bg}`}
      role="alert"
    >
      <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${currentStyle.iconText}`} />
      
      <div className="flex-1">
        <p className={`text-sm font-medium leading-5 ${currentStyle.text}`}>
          {message}
        </p>
      </div>

      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 transition-colors duration-150 rounded p-0.5 hover:bg-black/5"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
