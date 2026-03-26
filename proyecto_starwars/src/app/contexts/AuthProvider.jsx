"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("user");
      if (raw) {
        setUser(JSON.parse(raw));
        setIsAuthenticated(true);
      }
    }
    setLoading(false);
  }, []);

  // 🔹 LOGIN NORMAL (MockAPI)
  const login = async ({ email, password }) => {
    try {
      setLoading(true);
      const res = await fetch("https://690b87c26ad3beba00f55bf7.mockapi.io/users");
      const users = await res.json();

      const found = users.find(
        (u) => u.email === email && u.password === password
      );

      if (!found) throw new Error("Credenciales incorrectas");

      setUser(found);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(found));
      router.push("/");
    } catch (err) {
      alert(err.message || "Error en login");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loginDirect = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));
    router.push("/");
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        loginDirect, 
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}