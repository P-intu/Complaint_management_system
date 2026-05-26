import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, Menu, X, ArrowRight } from "lucide-react";

const LandingLayout = ({ children }) => {
  const { isAuthenticated, isStaff } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Sticky Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/70 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-md shadow-indigo-100">
                <ShieldCheck className="w-5.5 h-5.5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 bg-clip-text text-transparent">
                Resolve<span className="text-indigo-600">Flow</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Features</a>
              <a href="#workflow" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Workflow</a>
              <a href="#testimonials" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Trust</a>
              <a href="#faq" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">FAQ</a>
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <Link
                  to={isStaff ? "/admin" : "/complaints"}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all hover:scale-102 cursor-pointer"
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 shadow-md hover:scale-102 transition-all cursor-pointer"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-50 md:hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown Menu */}
        {mobileMenuOpen && (
          <div className="border-b border-slate-100 bg-white px-4 py-4 shadow-lg md:hidden animate-fade-in">
            <nav className="flex flex-col gap-4 mb-6">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
              >
                Features
              </a>
              <a
                href="#workflow"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
              >
                Workflow
              </a>
              <a
                href="#testimonials"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
              >
                Trust
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
              >
                FAQ
              </a>
            </nav>

            <div className="flex flex-col gap-3">
              {isAuthenticated ? (
                <Link
                  to={isStaff ? "/admin" : "/complaints"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-100"
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex justify-center rounded-xl border border-slate-200 py-2 text-sm font-semibold text-slate-600"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex justify-center rounded-xl bg-slate-900 py-2 text-sm font-semibold text-white"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 bg-slate-50">{children}</main>

      {/* Modern SaaS Footer */}
      <footer className="border-t border-slate-100 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                  <ShieldCheck className="w-4.5 h-4.5 text-white" />
                </div>
                <span className="text-lg font-bold text-slate-900">
                  Resolve<span className="text-indigo-600">Flow</span>
                </span>
              </div>
              <p className="text-sm text-slate-500 max-w-xs leading-5">
                The modern standard for corporate integrity, institutional compliance, and instant complaint resolution.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-4">Product</h4>
              <ul className="flex flex-col gap-2.5 text-sm text-slate-500">
                <li><a href="#features" className="hover:text-indigo-600 transition-colors">Features</a></li>
                <li><a href="#workflow" className="hover:text-indigo-600 transition-colors">Workflow</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Security</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-4">Resources</h4>
              <ul className="flex flex-col gap-2.5 text-sm text-slate-500">
                <li><a href="#faq" className="hover:text-indigo-600 transition-colors">FAQs</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">API Docs</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-4">Company</h4>
              <ul className="flex flex-col gap-2.5 text-sm text-slate-500">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Contact Support</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
              &copy; {new Date().getFullYear()} ResolveFlow Inc. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs text-slate-400">
              <a href="#" className="hover:text-slate-600">Privacy Policy</a>
              <a href="#" className="hover:text-slate-600">Security Audit</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingLayout;
