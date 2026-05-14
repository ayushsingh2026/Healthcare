import React, { createContext, useCallback, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email, password, role) => {
    const { data } = await api.post("/auth/login", { email, password, role });
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    return data;
  };

  const register = async (payload) => {
    const isFormData = typeof FormData !== "undefined" && payload instanceof FormData;
    const { data } = await api.post("/auth/register", payload, isFormData ? undefined : {});
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    return data;
  };

  const refreshMe = useCallback(async () => {
    if (!localStorage.getItem("user")) return null;
    const { data } = await api.get("/auth/me");
    const merged = { ...(JSON.parse(localStorage.getItem("user")) || {}), ...data };
    setUser(merged);
    localStorage.setItem("user", JSON.stringify(merged));
    return merged;
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, refreshMe, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
