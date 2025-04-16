import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { PiMoon, PiSun } from 'react-icons/pi';
import styles from './ThemeToggleButton.module.css';

const ThemeToggleButton: React.FC = () => {
  // Get initial theme from localStorage or system preference
  const { t } = useTranslation();
  const getInitialTheme = (): 'light' | 'dark' | 'system' => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return 'system';
  };

  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(getInitialTheme);

  const applyTheme = (newTheme: 'light' | 'dark' | 'system') => {
    const root = document.documentElement;

    if (newTheme === 'system') {
      localStorage.removeItem('theme');
      root.removeAttribute('data-theme');
    } else {
      localStorage.setItem('theme', newTheme);
      root.setAttribute('data-theme', newTheme);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
  };

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
      <div className={styles.activeIndicator}></div>
    </div>
  );
};

export default ThemeToggleButton;
