import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import LogoutButton from "./LogoutButton";
import { useTranslation } from "react-i18next";
import { IoIosGlobe } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaExchangeAlt } from "react-icons/fa";

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const username = localStorage.getItem("username");
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = i18n.language === "ko" ? "KO" : "EN";

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMobileMenu = () => setShowMobileMenu(false);

  return (
    <header className={styles.header}>
      <div className={styles.logo} onClick={() => navigate("/")}>
        Dusted
      </div>
      <nav className={styles.nav}>
        {username && (
          <>
            <span className={styles.navLink} onClick={() => { navigate("/"); closeMobileMenu(); }}>{t("Home")}</span>
            <span className={styles.navLink} onClick={() => { navigate("/reviews"); closeMobileMenu(); }}>{t("Collections")}</span>
            <LogoutButton onLogout={closeMobileMenu} />
          </>
        )}

        <div
          className={styles.languageSwitcher}
          onClick={() => setShowDropdown(!showDropdown)}
          ref={showMobileMenu ? () => {} : dropdownRef}
        >
          <IoIosGlobe size={25} />
          <span className={styles.languageLabel}>{currentLanguage}</span>
          {showDropdown && (
            <div className={styles.languageDropdown}>
              <button onClick={() => handleLanguageChange("en")}>English</button>
              <button onClick={() => handleLanguageChange("ko")}>한국어</button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu Icon */}
      <div className={styles.hamburgerMenu} onClick={() => setShowMobileMenu(!showMobileMenu)}>
        <GiHamburgerMenu size={25} />
      </div>

      {showMobileMenu && (
        <div className={styles.mobileMenuOverlay} onClick={closeMobileMenu}>
          <div className={styles.mobileMenu} onClick={(e) => e.stopPropagation()}>
            {username && (
              <>
                <span className={styles.navLink} onClick={() => { navigate("/"); closeMobileMenu(); }}>{t("Home")}</span>
                <span className={styles.navLink} onClick={() => { navigate("/reviews"); closeMobileMenu(); }}>{t("Collections")}</span>
                <LogoutButton onLogout={closeMobileMenu} />
              </>
            )}

            {/* Language Switcher */}
            <div
              className={styles.languageSwitcher}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <IoIosGlobe size={25} />
              <span className={styles.languageLabel}>{currentLanguage}</span>
            </div>
            {showDropdown && (
              <div
                className={styles.languageSwitcher}
                onClick={() => handleLanguageChange(i18n.language === "en" ? "ko" : "en")}
              >
                <FaExchangeAlt size={25} />
                <span className={styles.languageLabel}>{i18n.language === "en" ? "한국어" : "English"}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
