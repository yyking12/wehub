import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('wehub_theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });

  useEffect(() => {
    localStorage.setItem('wehub_theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    if (theme === 'dark') {
      document.documentElement.style.background = '#0a0a1a';
      document.body.style.background = `
        radial-gradient(ellipse at 20% 50%, rgba(120, 80, 200, 0.08) 0%, transparent 60%),
        radial-gradient(ellipse at 80% 20%, rgba(200, 100, 100, 0.05) 0%, transparent 60%),
        #0a0a1a
      `;
      document.body.style.color = '#f9fafb';
    } else {
      document.documentElement.style.background = '#f5f7fa';
      document.body.style.background = `
        radial-gradient(ellipse at 20% 50%, rgba(120, 80, 200, 0.08) 0%, transparent 60%),
        radial-gradient(ellipse at 80% 20%, rgba(100, 150, 200, 0.05) 0%, transparent 60%),
        #f5f7fa
      `;
      document.body.style.color = '#1f2937';
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
