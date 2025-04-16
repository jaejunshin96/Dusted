import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GiHamburgerMenu } from "react-icons/gi";
import { PiGlobe } from "react-icons/pi";
import { BsCollectionPlay, BsSearch } from "react-icons/bs";
import { AiOutlinePlus, AiOutlineUser } from "react-icons/ai";
import LogoutButton from "../auth/LogoutButton";
import styles from "./MobileHeader.module.css";

const MobileHeader: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem("username");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const closeMobileMenu = () => setShowMobileMenu(false);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    setShowDropdown(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
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
                <span
                  className={`${styles.navLink} ${isActive("/explore") ? styles.active : ""}`}
                  onClick={() => { navigate("/explore"); closeMobileMenu(); }}
                >
                  <BsSearch size={20} />
                  <span>{t("Explore")}</span>
                </span>

                <span
                  className={`${styles.navLink} ${isActive("/reviews") ? styles.active : ""}`}
                  onClick={() => { navigate("/reviews"); closeMobileMenu(); }}
                >
                  <BsCollectionPlay size={20} />
                  <span>{t("Collections")}</span>
                </span>

                <span
                  className={`${styles.navLink} ${isActive("/create") ? styles.active : ""}`}
                  onClick={() => { navigate("/create"); closeMobileMenu(); }}
                >
                  <AiOutlinePlus size={20} />
                  <span>{t("Create")}</span>
                </span>

                <span
                  className={`${styles.navLink} ${isActive("/profile") ? styles.active : ""}`}
                  onClick={() => { navigate("/profile"); closeMobileMenu(); }}
                >
                  <AiOutlineUser size={20} />
                  <span>{t("Profile")}</span>
                </span>

                <div className={styles.mobileNavDivider}></div>
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
