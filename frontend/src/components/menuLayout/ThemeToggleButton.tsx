import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { PiMoon, PiSun } from 'react-icons/pi';
import styles from './ThemeToggleButton.module.css';

const ThemeToggleButton: React.FC = () => {
  // Get initial theme from localStorage or system preference
  const { t } = useTranslation();

  const getSystemTheme = (): 'light' | 'dark' => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const getInitialTheme = (): 'light' | 'dark' | 'system' => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return 'system';
  };

  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(getInitialTheme);

  const toggleTheme = () => {
    const themeOrder: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
    const currentIndex = themeOrder.indexOf(theme);
    const nextTheme = themeOrder[(currentIndex + 1) % themeOrder.length];
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  const applyTheme = (newTheme: 'light' | 'dark' | 'system') => {
    const root = document.documentElement;

    if (newTheme === 'system') {
      localStorage.removeItem('theme');
      // Apply system preference
      const systemTheme = getSystemTheme();
      root.setAttribute('data-theme', systemTheme);
    } else {
      localStorage.setItem('theme', newTheme);
      root.setAttribute('data-theme', newTheme);
    }
  };

  // Listen for system theme changes when in 'system' mode
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleChange = () => {
        const systemTheme = getSystemTheme();
        document.documentElement.setAttribute('data-theme', systemTheme);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  useEffect(() => {
    // Apply the initial theme
    applyTheme(theme);
  }, []);

  // Get label for current theme state
  const getThemeLabel = () => {
    switch(theme) {
      case 'light': return t("Light mode");
      case 'dark': return t("Dark mode");
      default: return t("System theme");
    }
  };

  return (
    <div className={styles.themeToggleContainer} onClick={toggleTheme}>
      <div className={styles.themeIcon}>
        {theme === 'light' ? <PiSun size={20} /> : theme === 'dark' ? <PiMoon size={20} /> : (
          <div className={styles.systemIcon}>
            <PiSun className={styles.sunIcon} size={20} />
            <PiMoon className={styles.moonIcon} size={20} />
          </div>
        )}
      </div>
      <span className={styles.themeLabel}>{getThemeLabel()}</span>
    </div>
  );
};

export default ThemeToggleButton;
