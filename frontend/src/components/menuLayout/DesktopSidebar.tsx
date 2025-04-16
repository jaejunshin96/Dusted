import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaPlus, FaBookmark, FaUserAlt, FaRegCompass } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import ThemeToggleButton from "./ThemeToggleButton";
import LogoutButton from "../auth/LogoutButton";
import LanguageSelector from "./LanguageSelector";
import styles from "./DesktopSidebar.module.css";

const DesktopSidebar: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
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

  return (
    <nav className={styles.desktopSidebar}>
      <div className={styles.sidebarLogo}>Dusted</div>

      <div className={styles.sidebarLinks}>
        <div className={styles.sidebarLink} onClick={() => navigate("/explore")}>
          <FaRegCompass size={24} />
          <span>{t("Explore")}</span>
        </div>

        <div className={styles.sidebarLink} onClick={() => navigate("/reviews")}>
          <FaBookmark size={24} />
          <span>{t("Collections")}</span>
        </div>

        <div className={styles.sidebarLink} onClick={() => navigate("/create")}>
          <FaPlus size={24} />
          <span>{t("Create")}</span>
        </div>

        <div className={styles.sidebarLink} onClick={() => navigate("/profile")}>
          <FaUserAlt size={24} />
          <span>{t("Profile")}</span>
        </div>

        <div className={styles.sidebarBottom} ref={dropdownRef}>
          <div
            className={styles.moreButton}
            onClick={(e) => {
              e.stopPropagation();
              setShowDropdown(!showDropdown);
            }}
          >
            <GiHamburgerMenu size={24} />
            <span>{t("More")}</span>
          </div>

          {showDropdown && (
            <div className={styles.moreDropdown}>
              <div className={styles.dropdownItem}>
                <LanguageSelector />
              </div>

              <div className={styles.dropdownItem}>
                <ThemeToggleButton />
              </div>

              <div className={styles.dropdownItem}>
                <LogoutButton />
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default DesktopSidebar;
