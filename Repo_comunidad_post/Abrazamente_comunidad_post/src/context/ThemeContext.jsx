import { createContext, useEffect, useMemo, useState } from 'react';

const THEME_KEY = 'abrazamente.theme';

const getInitialTheme = () => {
  try {
    return localStorage.getItem(THEME_KEY) || 'light';
  } catch {
    return 'light';
  }
};

export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* noop */
    }
  }, [theme]);

  const value = useMemo(() => ({
    theme,
    toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
  }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
