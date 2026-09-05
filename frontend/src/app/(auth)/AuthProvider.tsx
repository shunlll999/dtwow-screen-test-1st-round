import { AUTH_EXPIRED_EVENT, tokenStore } from "@/lib/api";
import { authApi } from "@/lib/endpoints";
import { AuthResponse, AuthUser, Role } from "@/lib/types";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type AuthStatus = "loading" | "authenticated" | "anonymous";

interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  signIn: (response: AuthResponse) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
export const dashboardPathFor = (role: Role | "LOGIN") =>
  role === "ADMIN" ? "/admin" : role === "USER" ? "/user" : "/login";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);

  // Restore the session from the stored token on first load.
  useEffect(() => {
    let cancelled = false;
    Promise.resolve(tokenStore.get())
      .then((token) => (token ? authApi.me(token) : null))
      .then((me) => {
        if (cancelled) return;
        setUser(me);
        setStatus(me ? "authenticated" : "anonymous");
      })
      .catch(() => {
        if (cancelled) return;
        tokenStore.clear();
        setUser(null);
        setStatus("anonymous");
      });
    return () => {
      cancelled = true;
    };
  }, []);

    // React to "401 from the API" anywhere in the app.
  useEffect(() => {
    const onExpired = () => {
      setUser(null);
      setStatus('anonymous');
    };
    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
  }, []);

  const signIn = useCallback(
    (response: AuthResponse) => {
      tokenStore.set(response.accessToken);
      setUser(response.user);
      setStatus("authenticated");
      router.replace(dashboardPathFor(response.user.role));
    },
    [router],
  );

  const signOut = useCallback(() => {
    tokenStore.clear();
    setUser(null);
    setStatus("anonymous");
    router.replace("/login");
  }, [router]);

  const value = useMemo(
    () => ({ status, user, signIn, signOut }),
    [status, user, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
