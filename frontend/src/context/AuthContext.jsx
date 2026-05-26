import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize Auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      const accessToken = localStorage.getItem("access_token");
      const username = localStorage.getItem("username");
      const isStaff = localStorage.getItem("is_staff") === "true";
      const userId = localStorage.getItem("user_id");

      if (accessToken && username) {
        setUser({
          username,
          isStaff,
          userId: userId ? parseInt(userId, 10) : null,
        });
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Login handler
  const login = async (username, password) => {
    try {
      // POST requests SimpleJWT endpoint
      const response = await api.post("token/", { username, password });
      
      const { access, refresh, is_staff, user_id } = response.data;

      // Save tokens and user info to localStorage
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("username", username);
      localStorage.setItem("is_staff", is_staff ? "true" : "false");
      localStorage.setItem("user_id", user_id.toString());

      // Update axios headers (if using interceptors, it pulls dynamically, but let's be safe)
      api.defaults.headers.common["Authorization"] = `Bearer ${access}`;

      // Update React state
      const newUser = {
        username,
        isStaff: is_staff,
        userId: user_id,
      };
      setUser(newUser);
      return { success: true, user: newUser };
    } catch (error) {
      console.error("Auth login failure:", error);
      const message = error.response?.data?.detail || "Invalid username or password";
      return { success: false, message };
    }
  };

  // Register handler
  const register = async (username, password) => {
    try {
      await api.post("register/", { username, password });
      return { success: true };
    } catch (error) {
      console.error("Auth registration failure:", error);
      // Grab first error message if validation failed
      let message = "Registration failed. Please try again.";
      if (error.response?.data) {
        const errors = error.response.data;
        if (errors.username) {
          message = Array.isArray(errors.username) ? errors.username[0] : errors.username;
        } else if (errors.password) {
          message = Array.isArray(errors.password) ? errors.password[0] : errors.password;
        }
      }
      return { success: false, message };
    }
  };

  // Logout handler
  const logout = () => {
    // Clear credentials
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    localStorage.removeItem("is_staff");
    localStorage.removeItem("user_id");

    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isStaff: !!user?.isStaff,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
