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

  const setSpecificTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    applyTheme(newTheme);
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

    // Dispatch custom event so App.tsx knows theme changed in same window
    window.dispatchEvent(new Event('themeChanged'));
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

  return (
    <div className={styles.themeSubmenu}>
      <button
        className={`${styles.themeOption} ${theme === 'light' ? styles.activeTheme : ''}`}
        onClick={() => setSpecificTheme('light')}
      >
        <div className={styles.themeIcon}><PiSun size={20} /></div>
        <span>{t("Light mode")}</span>
        {theme === 'light' && <div className={styles.activeIndicator}></div>}
      </button>

      <button
        className={`${styles.themeOption} ${theme === 'dark' ? styles.activeTheme : ''}`}
        onClick={() => setSpecificTheme('dark')}
      >
        <div className={styles.themeIcon}><PiMoon size={20} /></div>
        <span>{t("Dark mode")}</span>
        {theme === 'dark' && <div className={styles.activeIndicator}></div>}
      </button>

      <button
        className={`${styles.themeOption} ${theme === 'system' ? styles.activeTheme : ''}`}
        onClick={() => setSpecificTheme('system')}
      >
        <div className={styles.systemIcon}>
          <PiSun className={styles.sunIcon} size={20} />
          <PiMoon className={styles.moonIcon} size={20} />
        </div>
        <span>{t("System theme")}</span>
        {theme === 'system' && <div className={styles.activeIndicator}></div>}
      </button>
    </div>
  );
};

export default ThemeToggleButton;
