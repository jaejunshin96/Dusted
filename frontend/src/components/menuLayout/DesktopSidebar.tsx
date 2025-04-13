import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PiGlobe } from "react-icons/pi";
import { FaHome, FaBookmark } from "react-icons/fa";
import LogoutButton from "../auth/LogoutButton";
import styles from "./DesktopSidebar.module.css";

const DesktopSidebar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    setShowDropdown(false);
  };

  return (
    <nav className={styles.desktopSidebar}>
      <div className={styles.sidebarLogo}>Dusted</div>

      <div className={styles.sidebarLinks}>
        <div className={styles.sidebarLink} onClick={() => navigate("/")}>
          <FaHome size={24} />
          <span>{t("Search")}</span>
        </div>

        <div className={styles.sidebarLink} onClick={() => navigate("/reviews")}>
          <FaBookmark size={24} />
          <span>{t("Collections")}</span>
        </div>

        <div className={styles.sidebarBottom}>
          <div
            className={styles.languageSwitcher}
            onClick={() => setShowDropdown(!showDropdown)}
            ref={dropdownRef}
          >
            <PiGlobe size={24} />
            <span>{i18n.language === "ko" ? "KO" : "EN"}</span>
          </div>
          
          {showDropdown && (
            <div className={styles.languageDropdown}>
              <button onClick={() => handleLanguageChange("en")}>English</button>
              <button onClick={() => handleLanguageChange("ko")}>한국어</button>
            </div>
          )}

          <LogoutButton/>
        </div>
      </div>
    </nav>
  );
};

export default DesktopSidebar;
