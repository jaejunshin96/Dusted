import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaSearch, FaBookmark, FaUserAlt, FaRegCompass } from "react-icons/fa";
import { PiMoon, PiSun, PiGlobe } from 'react-icons/pi';
import { GiHamburgerMenu } from "react-icons/gi";
import { IoChevronBack } from "react-icons/io5";
import ThemeToggleButton from "./ThemeToggleButton";
import LogoutButton from "../auth/LogoutButton";
import LanguageSelector from "./LanguageSelector";
import styles from "./DesktopSidebar.module.css";

const DesktopSidebar: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentView, setCurrentView] = useState<'main' | 'language' | 'theme'>('main');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Helper function to check if a route is active
  const isActive = (path: string) => location.pathname === path;

  const getInitialTheme = (): 'light' | 'dark' | 'system' => {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
      return 'system';
    };

    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(getInitialTheme);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setCurrentView('main');
      }
    };

    // Only add the event listener when the dropdown is shown
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleLanguageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentView('language');
  };

  const handleThemeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentView('theme');
  };

  const handleBackClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentView('main');
  };

  return (
    <nav className={styles.desktopSidebar}>
      <div className={styles.sidebarLogo}>Dusted</div>

      <div className={styles.sidebarLinks}>
        <div
          className={`${styles.sidebarLink} ${isActive("/explore") ? styles.active : ""}`}
          onClick={() => navigate("/explore")}
        >
          <FaRegCompass size={24} />
          <span>{t("Explore")}</span>
        </div>

        <div
          className={`${styles.sidebarLink} ${isActive("/search") ? styles.active : ""}`}
          onClick={() => navigate("/search")}
        >
          <FaSearch size={24} />
          <span>{t("Search")}</span>
        </div>

        <div
          className={`${styles.sidebarLink} ${isActive("/reviews") ? styles.active : ""}`}
          onClick={() => navigate("/reviews")}
        >
          <FaBookmark size={24} />
          <span>{t("Collections")}</span>
        </div>

        <div
          className={`${styles.sidebarLink} ${isActive("/profile") ? styles.active : ""}`}
          onClick={() => navigate("/profile")}
        >
          <FaUserAlt size={24} />
          <span>{t("Profile")}</span>
        </div>

        <div className={styles.sidebarBottom} ref={dropdownRef}>
          <div
            className={styles.moreButton}
            onClick={() => {setShowDropdown(!showDropdown);}}
          >
            <GiHamburgerMenu size={24} />
            <span>{t("More")}</span>
          </div>

          {showDropdown && (
            <div className={styles.moreDropdown}>
              {currentView === 'main' && (
                <div className={styles.menuView}>
                  <div className={styles.dropdownItem} onClick={handleLanguageClick}>
                    <PiGlobe size={20} />
                    <span>{t("Language")}</span>
                  </div>

                  <div className={styles.dropdownItem} onClick={handleThemeClick}>
                    <div className={styles.systemIcon}>
                      <PiSun className={styles.sunIcon} size={20} />
                      <PiMoon className={styles.moonIcon} size={20} />
                    </div>
                    <span>{t("Switch appearance")}</span>
                  </div>

                  <div className={`${styles.dropdownItem} ${styles.logoutButton}`}>
                    <LogoutButton />
                  </div>
                </div>
              )}

              {currentView === 'language' && (
                <div className={styles.menuView}>
                  <div className={styles.menuHeader} onClick={handleBackClick}>
                    <IoChevronBack size={20} />
                    <span>{t("Language")}</span>
                  </div>
                  <LanguageSelector />
                </div>
              )}

              {currentView === 'theme' && (
                <div className={styles.menuView}>
                  <div className={styles.menuHeader} onClick={handleBackClick}>
                    <IoChevronBack size={20} />
                    <span>{t("Switch appearance")}</span>
                  </div>
                  <ThemeToggleButton />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default DesktopSidebar;
