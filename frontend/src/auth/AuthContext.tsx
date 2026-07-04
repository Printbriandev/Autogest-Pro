import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { authApi } from '../api/endpoints';
import { ApiError, setToken } from '../api/client';
import type { LoginResponse } from '../api/types';

interface AuthUser {
  idUsuario: number;
  nombreCompleto: string;
  rol: string;
  fechaExpiracion: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (nombreUsuario: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const USER_KEY = 'autogest.user';

function readStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readStoredUser);

  const login = useCallback(async (nombreUsuario: string, password: string) => {
    const response = await authApi.login({ nombreUsuario, password });
    const data: LoginResponse | null = response.data;
    if (!response.success || !data) {
      throw new ApiError(401, response.message || 'Credenciales invalidas.');
    }

    setToken(data.token);
    const nextUser: AuthUser = {
      idUsuario: data.idUsuario,
      nombreCompleto: data.nombreCompleto,
      rol: data.rol,
      fechaExpiracion: data.fechaExpiracion,
    };
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: user !== null, login, logout }),
    [user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>.');
  }
  return ctx;
}
