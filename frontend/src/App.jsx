import React from "react";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
          <AppRoutes />
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;