import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GiHamburgerMenu } from "react-icons/gi";
import { PiGlobe } from "react-icons/pi";
//import { FaExchangeAlt } from "react-icons/fa";
import LogoutButton from "../auth/LogoutButton";
import styles from "./MobileHeader.module.css";

const MobileHeader: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const closeMobileMenu = () => setShowMobileMenu(false);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    setShowDropdown(false);
  };

  return (
    <header className={styles.mobileHeader}>
      <div className={styles.logo} onClick={() => navigate("/")}>
        Dusted
      </div>

      <div className={styles.hamburgerMenu} onClick={() => setShowMobileMenu(!showMobileMenu)}>
        <GiHamburgerMenu size={25} />
      </div>

      {showMobileMenu && (
        <div className={styles.mobileMenuOverlay} onClick={closeMobileMenu}>
          <div className={styles.mobileMenu} onClick={(e) => e.stopPropagation()}>
            {username && (
              <>
                <span className={styles.navLink} onClick={() => { navigate("/"); closeMobileMenu(); }}>
                  {t("Home")}
                </span>
                <span className={styles.navLink} onClick={() => { navigate("/reviews"); closeMobileMenu(); }}>
                  {t("Collections")}
                </span>
                <LogoutButton onLogout={closeMobileMenu} />
              </>
            )}

            <div className={styles.languageSwitcher} onClick={() => setShowDropdown(!showDropdown)}>
              <PiGlobe size={25} />
              <span>{i18n.language === "ko" ? "KO" : "EN"}</span>
            </div>
            {showDropdown && (
              <div className={styles.languageDropdown}>
                <button onClick={() => handleLanguageChange("en")}>English</button>
                <button onClick={() => handleLanguageChange("ko")}>한국어</button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default MobileHeader;
