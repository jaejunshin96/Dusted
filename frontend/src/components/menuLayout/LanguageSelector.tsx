import React, { useState } from "react";
import { PiGlobe } from "react-icons/pi";
import { useTranslation } from "react-i18next";
import styles from "./LanguageSelector.module.css";

type LanguageOption = {
  code: string;
  label: string;
};

const languages: LanguageOption[] = [
  { code: "en", label: "English" },
  { code: "ko", label: "한국어" }
];

const LanguageSelector: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [showOptions, setShowOptions] = useState(false);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    setShowOptions(false);
  };

  return (
    <div className={styles.languageToggleContainer} onClick={() => setShowOptions(!showOptions)}>
      <div className={styles.languageIcon}>
        <PiGlobe size={20} />
      </div>
      <span className={styles.languageLabel}>{t("Language")}</span>

      {showOptions && (
        <div className={styles.languageOptions}>
          {languages.map((language) => (
            <button
              key={language.code}
              className={i18n.language === language.code ? styles.activeLanguage : ""}
              onClick={(e) => {
                e.stopPropagation();
                handleLanguageChange(language.code);
              }}
            >
              {language.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
