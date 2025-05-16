import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { FaSearch, FaBookmark, FaUserAlt, FaRegCompass, FaLanguage } from "react-icons/fa";
import { MdCollections } from "react-icons/md";
import { PiMoon, PiSun, PiGlobe } from 'react-icons/pi';
import { GiHamburgerMenu } from "react-icons/gi";
import { IoChevronBack } from "react-icons/io5";
import { BiLoaderAlt } from "react-icons/bi";
import ThemeToggleButton from "./ThemeToggleButton";
import LanguageSelector from "./LanguageSelector";
import styles from "./DesktopSidebar.module.css";
import CountrySelector from "./CountrySelector";

const DesktopSidebar: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentView, setCurrentView] = useState<'main' | 'language' | 'country' | 'theme'>('main');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Helper function to check if a route is active
  const isActive = (path: string) => location.pathname === path;

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

  const handleNavigation = (path: string) => {
    navigate(path);
    setShowDropdown(false);
    setCurrentView('main');
    window.scrollTo(0, 0);
  };

  const handleLanguageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentView('language');
  };

  const handleCountryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentView('country');
  };

  const handleThemeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentView('theme');
  };

  const handleBackClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentView('main');
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      const accessToken = localStorage.getItem("access_token");

      if (refreshToken) {
        // Call the backend logout endpoint using axios
        await axios.post(
          `${backendUrl}/api/auth/logout/`,
          { refresh: refreshToken },
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${accessToken}`
            }
          }
        );
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local storage regardless of server response
      localStorage.removeItem("email");
      localStorage.removeItem("username");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      setIsLoggingOut(false);
      navigate("/login");
    }
  };

  return (
    <nav className={styles.desktopSidebar}>
      <div className={styles.sidebarLogo} onClick={() => handleNavigation("/")}>
        Dusted
      </div>

      <div className={styles.sidebarLinks}>
        <div
          className={`${styles.sidebarLink} ${isActive("/") ? styles.active : ""}`}
          onClick={() => handleNavigation("/")}
        >
          <FaRegCompass size={24} />
          <span>{t("Explore")}</span>
        </div>

        <div
          className={`${styles.sidebarLink} ${isActive("/search") ? styles.active : ""}`}
          onClick={() => handleNavigation("/search")}
        >
          <FaSearch size={24} />
          <span>{t("Search")}</span>
        </div>

        <div
          className={`${styles.sidebarLink} ${isActive("/watchlist") ? styles.active : ""}`}
          onClick={() => handleNavigation("/watchlist")}
        >
          <FaBookmark size={24} />
          <span>{t("Watchlist")}</span>
        </div>

        <div
          className={`${styles.sidebarLink} ${isActive("/reviews") ? styles.active : ""}`}
          onClick={() => handleNavigation("/reviews")}
        >
          <MdCollections size={24} />
          <span>{t("Collections")}</span>
        </div>

        <div
          className={`${styles.sidebarLink} ${isActive("/profile") ? styles.active : ""}`}
          onClick={() => handleNavigation("/profile")}
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
                    <FaLanguage size={20} />
                    <span>{t("Language")}</span>
                  </div>

                  <div className={styles.dropdownItem} onClick={handleCountryClick}>
                    <PiGlobe size={20} />
                    <span>{t("Country")}</span>
                  </div>

                  <div className={styles.dropdownItem} onClick={handleThemeClick}>
                    <div className={styles.systemIcon}>
                      <PiSun className={styles.sunIcon} size={20} />
                      <PiMoon className={styles.moonIcon} size={20} />
                    </div>
                    <span>{t("Switch appearance")}</span>
                  </div>

                  <div className={`${styles.dropdownItem} ${styles.logoutButton}`} onClick={handleLogout}>
                    {isLoggingOut ? (
                      <BiLoaderAlt size={20} className={styles.spinner} />
                    ) : (
                      <span>{t("Log out")}</span>
                    )}
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

              {currentView === 'country' && (
                <div className={styles.menuView}>
                  <div className={styles.menuHeader} onClick={handleBackClick}>
                    <IoChevronBack size={20} />
                    <span>{t("Country")}</span>
                  </div>
                  <CountrySelector />
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
