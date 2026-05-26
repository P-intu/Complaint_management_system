import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Sparkles, AlertCircle, CheckCircle } from "lucide-react";

const AuthLayout = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Left side: Premium SaaS visual brand panel */}
      <div className="relative hidden md:flex md:w-[45%] lg:w-[40%] bg-slate-900 overflow-hidden flex-col justify-between p-8 text-white z-0 bg-mesh">
        {/* Glow accent meshes (managed by index.css bg-mesh, but let's add custom absolute details) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.18),transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.12),transparent_40%)]" />

        {/* Top: Logo */}
        <div className="flex items-center gap-2 cursor-pointer z-10" onClick={() => navigate("/")}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600">
            <ShieldCheck className="w-5.5 h-5.5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Resolve<span className="text-indigo-400">Flow</span>
          </span>
        </div>

        {/* Center: Glowing Product Taglines and live feedback widgets */}
        <div className="my-auto flex flex-col gap-6 z-10">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-indigo-300 w-fit backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Empowering Modern Compliance
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
            Seamless case audits. <br />
            Instant resolutions.
          </h2>
          
          <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
            Report administrative issues, track investigations, and check updates securely in real-time. Transparent accountability at your fingertips.
          </p>

          {/* Interactive Floating Metrics */}
          <div className="flex flex-col gap-3 mt-4">
            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm animate-float">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                <CheckCircle className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Average resolution speed</p>
                <p className="text-sm font-bold text-white">Under 24 hours</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
                <AlertCircle className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Active active audit queue</p>
                <p className="text-sm font-bold text-white">100% End-to-end encrypted</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom footer credit */}
        <div className="z-10 text-xs text-slate-500">
          Powered by ResolveFlow Enterprise. &copy; {new Date().getFullYear()}
        </div>
      </div>

      {/* Right side: Login / Register Form Container */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-radial from-white to-slate-50">
        {/* Glow meshes for mobile */}
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-100/30 blur-3xl rounded-full z-0 pointer-events-none block md:hidden" />
        
        <div className="w-full max-w-md z-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
