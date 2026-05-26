import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { KeyRound, User, Loader2, ArrowRight } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const tempErrors = {};
    if (!username.trim()) tempErrors.username = "Username is required";
    if (!password) tempErrors.password = "Password is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const result = await login(username, password);
    setLoading(false);

    if (result.success) {
      showToast(`Welcome back, ${result.user.username}!`, "success");
      // Direct user based on role
      if (result.user.isStaff) {
        navigate("/admin");
      } else {
        navigate("/complaints");
      }
    } else {
      showToast(result.message, "error");
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl glass-panel animate-fade-in">
      <div className="flex flex-col gap-2 mb-8">
        <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">
          Sign In
        </h2>
        <p className="text-sm text-slate-500">
          Enter your institutional credentials below to audit your complaints.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Username */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1">
            Username
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full pl-11 pr-4 py-2.5 rounded-xl border glass-input text-sm text-slate-800 ${
                errors.username ? "border-rose-300 bg-rose-50/10 focus:border-rose-500 focus:ring-rose-500/10" : ""
              }`}
            />
          </div>
          {errors.username && (
            <p className="text-xs text-rose-500 font-semibold pl-1">
              {errors.username}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1">
            Password
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full pl-11 pr-4 py-2.5 rounded-xl border glass-input text-sm text-slate-800 ${
                errors.password ? "border-rose-300 bg-rose-50/10 focus:border-rose-500 focus:ring-rose-500/10" : ""
              }`}
            />
          </div>
          {errors.password && (
            <p className="text-xs text-rose-500 font-semibold pl-1">
              {errors.password}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-950 py-3 text-sm font-bold text-white shadow-lg shadow-slate-200 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 transition-all duration-200 cursor-pointer disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Verifying credentials...
            </>
          ) : (
            <>
              Access Account
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Redirect Footer */}
      <div className="mt-8 pt-6 border-t border-slate-100 text-center">
        <p className="text-sm text-slate-500">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-indigo-600 font-bold hover:underline bg-transparent border-0 cursor-pointer"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;