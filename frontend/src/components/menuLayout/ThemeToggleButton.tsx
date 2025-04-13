import React, { useEffect, useState } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import styles from './ThemeToggleButton.module.css';

const ThemeToggleButton: React.FC = () => {
  // Get initial theme from localStorage or system preference
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

  return (
    <button onClick={toggleTheme} className={styles.themeToggle} aria-label="Toggle theme">
      {theme === 'light' ? <FaSun /> : theme === 'dark' ? <FaMoon /> :
        <div className={styles.systemIcon}>
          <FaSun className={styles.sunIcon} />
          <FaMoon className={styles.moonIcon} />
        </div>
      }
    </button>
  );
};

export default ThemeToggleButton;
