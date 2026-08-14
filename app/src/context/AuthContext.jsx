import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const register = useCallback(async (values) => {
    const res = await api.post("/auth/register", values);
    setUser(res.data);
    return res.data;
  }, []);

  const login = useCallback(async (values) => {
    const res = await api.post("/auth/login", values);
    setUser(res.data);
    return res.data;
  }, []);

  const logout = useCallback(async () => {
    await api.post("/auth/logout");
    setUser(null);
  }, []);

  const changePassword = useCallback(async (values) => {
    await api.post("/auth/change-password", values);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, logout, changePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
