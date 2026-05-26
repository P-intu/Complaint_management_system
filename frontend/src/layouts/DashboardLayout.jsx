import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { 
  ShieldCheck, 
  FileText, 
  PlusCircle, 
  Users, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  X, 
  User, 
  ChevronRight 
} from "lucide-react";

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showToast("Logged out successfully", "info");
    navigate("/");
  };

  // Generate an avatar initial
  const initial = user?.username ? user.username.charAt(0).toUpperCase() : "U";

  // Sidebar Menu Items based on role
  const menuItems = user?.isStaff
    ? [
        {
          label: "Admin Panel",
          path: "/admin",
          icon: LayoutDashboard,
        },
      ]
    : [
        {
          label: "Dashboard",
          path: "/complaints",
          icon: FileText,
        },
        {
          label: "Submit Case",
          path: "/create",
          icon: PlusCircle,
        },
      ];

  // Helper to get active route class
  const isLinkActive = (path) => location.pathname === path;

  const SidebarContent = () => (
    <div className="flex h-full flex-col justify-between p-4 bg-slate-900 text-slate-300">
      <div className="flex flex-col gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2 px-2 cursor-pointer" onClick={() => navigate("/")}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 shadow-md shadow-indigo-500/10">
            <ShieldCheck className="w-5.5 h-5.5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Resolve<span className="text-indigo-400">Flow</span>
          </span>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500 text-white font-bold text-lg shadow-inner">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-white truncate leading-tight">
              {user?.username || "Guest User"}
            </p>
            <p className="text-xs text-slate-500 truncate mt-0.5 capitalize">
              {user?.isStaff ? "System Admin" : "Reporter Account"}
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isLinkActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  active
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                    : "hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${active ? "text-white" : "text-slate-400"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-200 border border-transparent hover:border-rose-500/10 cursor-pointer"
      >
        <LogOut className="w-5 h-5 shrink-0" />
        Sign Out
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 border-r border-slate-200/50">
        <div className="sticky top-0 h-screen w-full">
          <SidebarContent />
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Floating Glassbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-md px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Breadcrumb path */}
            <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-500">
              <span>Workspace</span>
              <ChevronRight className="w-4 h-4 text-slate-300" />
              <span className="text-slate-900 font-bold capitalize">
                {location.pathname.split("/")[1] || "Complaints"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Role Badge Indicator */}
            {user?.isStaff && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 border border-indigo-200 text-indigo-700">
                Admin Console
              </span>
            )}
            
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 font-bold text-sm">
              {initial}
            </div>
          </div>
        </header>

        {/* Dynamic page contents wrapper */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 animate-fade-in relative z-0">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop blur overlay */}
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          {/* Menu Drawer */}
          <div className="relative w-64 animate-slide-up flex flex-col h-full z-10">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="h-full">
              <SidebarContent />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
