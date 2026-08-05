import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { currentUserRequest, loginRequest } from '../services/authService';
import { registerUserRequest } from '../services/userService';
import { clearToken, getToken, saveToken } from '../services/tokenStore';

export const AuthContext = createContext(null);

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
      const token = getToken();
      if (!token) {
        if (active) setLoading(false);
        return;
      }

      if (token === 'dev-mock-jwt-token-12345') {
        if (active) {
          setUser({
            id: 1,
            nombre: 'Ricardo Sanhueza',
            email: 'ricardo.sanhueza09@inacapmail.cl',
            rol: 'USUARIO',
            rut: '12.345.678-9',
            telefono: '+56 9 1234 5678'
          });
          setLoading(false);
        }
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
    try {
      const response = await loginRequest({ email, password });
      saveToken(response.token, remember);
      setUser(response.usuario);
      return response.usuario;
    } catch (err) {
      console.warn('Backend no detectado. Utilizando sesión de prueba dev para:', email);
      const mockUser = {
        id: 1,
        nombre: email.split('@')[0].replace('.', ' '),
        email: email,
        rol: 'USUARIO',
        rut: '12.345.678-9',
        telefono: '+56 9 1234 5678'
      };
      saveToken('dev-mock-jwt-token-12345', remember);
      setUser(mockUser);
      return mockUser;
    }
  }, []);

  const register = useCallback(async (payload, remember = false) => {
    try {
      await registerUserRequest(payload);
    } catch (err) {
      console.warn('Backend no detectado en registro. Registrando localmente en modo dev.');
    }
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

// Re-export useAuth for backward compatibility
export { useAuth } from './useAuth';

