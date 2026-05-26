import React, { useEffect } from "react";
import { AlertTriangle, Trash2, HelpCircle, X } from "lucide-react";

const Modal = ({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onClose,
  type = "info", // "info", "danger", "warning"
}) => {
  // Lock scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const styles = {
    danger: {
      iconBg: "bg-rose-100 text-rose-600 border-rose-200",
      buttonBg: "bg-rose-600 hover:bg-rose-700 focus:ring-rose-500 shadow-rose-200",
      Icon: Trash2,
    },
    warning: {
      iconBg: "bg-amber-100 text-amber-600 border-amber-200",
      buttonBg: "bg-amber-500 hover:bg-amber-600 focus:ring-amber-400 shadow-amber-200",
      Icon: AlertTriangle,
    },
    info: {
      iconBg: "bg-indigo-100 text-indigo-600 border-indigo-200",
      buttonBg: "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 shadow-indigo-200",
      Icon: HelpCircle,
    },
  };

  const currentStyle = styles[type] || styles.info;
  const { Icon } = currentStyle;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl transition-all duration-300 transform scale-100 animate-slide-up glass-panel">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all duration-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex gap-4 items-start">
          <div className={`flex shrink-0 items-center justify-center rounded-xl border p-2.5 ${currentStyle.iconBg}`}>
            <Icon className="w-6 h-6" />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 leading-6">
              {title}
            </h3>
            <p className="mt-2 text-sm text-slate-500 leading-5">
              {message}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 cursor-pointer"
          >
            {cancelText}
          </button>
          
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 cursor-pointer ${currentStyle.buttonBg}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
