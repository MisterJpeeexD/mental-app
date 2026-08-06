import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme debe utilizarse dentro de ThemeProvider');
  return context;
}
