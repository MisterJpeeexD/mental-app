import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { currentUserRequest, loginRequest } from '../services/authService';
import { registerUserRequest } from '../services/userService';
import { clearToken, getToken, saveToken } from '../services/tokenStore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      if (!getToken()) {
        if (active) setLoading(false);
        return;
      }

      try {
        const currentUser = await currentUserRequest();
        if (active) setUser(currentUser);
      } catch {
        clearToken();
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    restoreSession();
    const onUnauthorized = () => logout();
    window.addEventListener('abrazamente:unauthorized', onUnauthorized);

    return () => {
      active = false;
      window.removeEventListener('abrazamente:unauthorized', onUnauthorized);
    };
  }, [logout]);

  const login = useCallback(async ({ email, password, remember = false }) => {
    const response = await loginRequest({ email, password });
    saveToken(response.token, remember);
    setUser(response.usuario);
    return response.usuario;
  }, []);

  const register = useCallback(async (payload, remember = false) => {
    await registerUserRequest(payload);
    return login({ email: payload.email, password: payload.password, remember });
  }, [login]);

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
  }), [user, loading, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe utilizarse dentro de AuthProvider');
  return context;
}
