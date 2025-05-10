import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GiHamburgerMenu } from "react-icons/gi";
import { PiGlobe, PiMoon, PiSun } from "react-icons/pi";
import { FaSearch, FaBookmark, FaUserAlt, FaRegCompass, FaLanguage } from "react-icons/fa";
import { MdCollections } from "react-icons/md";
import { IoChevronBack, IoChevronForward, IoClose } from "react-icons/io5";
import ThemeToggleButton from "./ThemeToggleButton";
import LanguageSelector from "./LanguageSelector";
import CountrySelector from "./CountrySelector";
import styles from "./MobileHeader.module.css";

const MobileHeader: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem("username");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [currentView, setCurrentView] = useState<'main' | 'language' | 'country' | 'theme'>('main');
  const menuRef = useRef<HTMLDivElement>(null);

  // Add this effect to disable scrolling when mobile menu is open
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [showMobileMenu]);

  const closeMobileMenu = () => {
    setShowMobileMenu(false);
    setCurrentView('main');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
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

  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    closeMobileMenu();
    navigate("/login");
    window.scrollTo(0, 0);
  };

  // Add this function to handle navigation with scroll reset
  const handleNavigation = (path: string) => {
    navigate(path);
    closeMobileMenu();
    window.scrollTo(0, 0); // Reset scroll position to top
  };

  return (
    <header className={styles.mobileHeader}>
      <div className={styles.logo} onClick={() => handleNavigation("/")}>
        Dusted
      </div>

      <div className={styles.hamburgerMenu} onClick={() => setShowMobileMenu(!showMobileMenu)}>
        {showMobileMenu ?
          <IoClose size={25} />
          :
          <GiHamburgerMenu size={25} />
        }
      </div>

      {showMobileMenu && (
          <div className={styles.mobileMenu} onClick={(e) => e.stopPropagation()} ref={menuRef}>
            {currentView === 'main' && username && (
              <>
                <div
                  className={`${styles.navLink} ${isActive("/") ? styles.active : ""}`}
                  onClick={() => handleNavigation("/")}
                >
                  <FaRegCompass size={20} />
                  <span>{t("Explore")}</span>
                </div>

                <div
                  className={`${styles.navLink} ${isActive("/search") ? styles.active : ""}`}
                  onClick={() => handleNavigation("/search")}
                >
                  <FaSearch size={20} />
                  <span>{t("Search")}</span>
                </div>

                <div
                  className={`${styles.navLink} ${isActive("/watchlist") ? styles.active : ""}`}
                  onClick={() => handleNavigation("/watchlist")}
                >
                  <FaBookmark size={20} />
                  <span>{t("Watchlist")}</span>
                </div>

                <div
                  className={`${styles.navLink} ${isActive("/reviews") ? styles.active : ""}`}
                  onClick={() => handleNavigation("/reviews")}
                >
                  <MdCollections size={20} />
                  <span>{t("Collections")}</span>
                </div>

                <div
                  className={`${styles.navLink} ${isActive("/profile") ? styles.active : ""}`}
                  onClick={() => handleNavigation("/profile")}
                >
                  <FaUserAlt size={20} />
                  <span>{t("Profile")}</span>
                </div>

                <div className={styles.mobileNavDivider}></div>

                <div className={`${styles.navLink} ${styles.navLinkContent}`} onClick={handleLanguageClick}>
                  <div className={styles.navLinkLeft}>
                    <FaLanguage size={20} />
                    <span>{t("Language")}</span>
                  </div>
                  <IoChevronForward size={18} />
                </div>

                <div className={`${styles.navLink} ${styles.navLinkContent}`} onClick={handleCountryClick}>
                  <div className={styles.navLinkLeft}>
                    <PiGlobe size={20} />
                    <span>{t("Country")}</span>
                  </div>
                  <IoChevronForward size={18} />
                </div>

                <div className={`${styles.navLink} ${styles.navLinkContent}`} onClick={handleThemeClick}>
                  <div className={styles.navLinkLeft}>
                    <div className={styles.systemIcon}>
                      <PiSun className={styles.sunIcon} size={20} />
                      <PiMoon className={styles.moonIcon} size={20} />
                    </div>
                    <span>{t("Switch appearance")}</span>
                  </div>
                  <IoChevronForward size={18} />
                </div>

                {/*<div className={styles.mobileNavDivider}></div>*/}

                <div className={`${styles.navLink} ${styles.logoutButton}`} onClick={handleLogout}>
                  <span>{t("Log out")}</span>
                </div>
              </>
            )}

            {currentView === 'language' && (
              <div className={styles.subMenuView}>
                <div className={styles.menuHeader} onClick={handleBackClick}>
                  <IoChevronBack size={20} />
                  <span>{t("Language")}</span>
                </div>
                <LanguageSelector />
              </div>
            )}

            {currentView === 'country' && (
              <div className={styles.subMenuView}>
                <div className={styles.menuHeader} onClick={handleBackClick}>
                  <IoChevronBack size={20} />
                  <span>{t("Country")}</span>
                </div>
                <CountrySelector />
              </div>
            )}

            {currentView === 'theme' && (
              <div className={styles.subMenuView}>
                <div className={styles.menuHeader} onClick={handleBackClick}>
                  <IoChevronBack size={20} />
                  <span>{t("Switch appearance")}</span>
                </div>
                <ThemeToggleButton />
              </div>
            )}
          </div>
      )}
    </header>
  );
};

export default MobileHeader;
