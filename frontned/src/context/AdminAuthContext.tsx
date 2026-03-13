import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "@/services/api";
import { setAuthToken, getAuthToken } from "@/services/apiClient";

type AdminUser = { id: string; email: string };

type AdminAuthContextValue = {
  admin: AdminUser | null;
  token: string | null;
  loading: boolean;
  hasAdmin: boolean | null;
  login: (email: string, password: string) => Promise<void>;
  setup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshStatus: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(getAuthToken());
  const [loading, setLoading] = useState(true);
  const [hasAdmin, setHasAdmin] = useState<boolean | null>(null);

  const refreshStatus = async () => {
    try {
      const status = await authApi.status();
      setHasAdmin(status.hasAdmin);
    } catch {
      setHasAdmin(null);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = () => setToken(getAuthToken());
    window.addEventListener("cfsmcca-auth", handler);
    return () => window.removeEventListener("cfsmcca-auth", handler);
  }, []);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      await refreshStatus();
      if (!token) {
        if (mounted) setLoading(false);
        return;
      }
      try {
        const me = await authApi.me();
        if (mounted) setAdmin(me);
      } catch {
        setAuthToken(null);
        if (mounted) {
          setToken(null);
          setAdmin(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    init();
    return () => {
      mounted = false;
    };
  }, [token]);

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    setAuthToken(response.token);
    setToken(response.token);
    setAdmin(response.admin);
  };

  const setup = async (email: string, password: string) => {
    await authApi.setup({ email, password });
    await login(email, password);
  };

  const logout = () => {
    setAuthToken(null);
    setToken(null);
    setAdmin(null);
  };

  const value = useMemo(
    () => ({
      admin,
      token,
      loading,
      hasAdmin,
      login,
      setup,
      logout,
      refreshStatus
    }),
    [admin, token, loading, hasAdmin]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
};
